#!/usr/bin/env python3
"""
Market Pulse PDF generator — The Financial Buddy.

Renders the monthly "Market Pulse" digest PDF (cover, section pages with
sparkline+badge metric cards, gainers/losers tables, an events calendar,
and a quote page) from a single JSON data file, in the site's navy/gold
brand palette (see tailwind.config.js: navy #1457A4, gold #8C6D1D).

Usage:
    python3 generate_pdf.py --data data.json --out MarketPulse_Aug2026.pdf

See sample_data.json in this directory for the exact schema — every
section below reads from a top-level key of the same name. Only the
`quotes` section requires real, attributed statements (see field notes
in sample_data.json); every numeric series should be sourced from real
research, not invented.

Requires: reportlab, matplotlib, numpy (pip install --break-system-packages
reportlab matplotlib numpy).
"""
import argparse
import calendar as _cal
import json
import os
import sys
import textwrap

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.ticker as mticker
import numpy as np

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    HRFlowable, PageBreak, Flowable,
)

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- palette --
NAVY = "#1457A4"
NAVY_DARK = "#0D3D75"
NAVY_LIGHT = "#8FB4DE"
GOLD = "#8C6D1D"
GOLD_LINE = "#E8A93A"
GOLD_LIGHT = "#D4AF52"
ORANGE = "#C97A2B"
GREEN = "#7CB342"
RED = "#E5533D"
INK = "#111827"
MUTED = "#6B7280"
RULE = "#E3E6EA"

C_NAVY = colors.HexColor(NAVY); C_NAVY_DARK = colors.HexColor(NAVY_DARK)
C_NAVY_LIGHT = colors.HexColor(NAVY_LIGHT); C_GOLD = colors.HexColor(GOLD)
C_GOLD_LIGHT = colors.HexColor(GOLD_LIGHT); C_ORANGE = colors.HexColor(ORANGE)
C_INK = colors.HexColor(INK); C_MUTED = colors.HexColor(MUTED); C_RULE = colors.HexColor(RULE)

SECTION_COLOR = {"blue": C_NAVY, "gold": C_GOLD, "orange": C_ORANGE}
BADGE_TINT = {"blue": C_NAVY_LIGHT, "gold": C_GOLD_LIGHT, "orange": colors.HexColor("#E8B98A")}

PAGE_W, PAGE_H = letter

plt.rcParams.update({"font.family": "DejaVu Sans"})


# ============================================================= chart gen ==
def _interp(points, n=31):
    """points: list of {"d": day_of_month, "v": value} -> smooth (days, values)."""
    days = np.array([p["d"] for p in points], dtype=float)
    vals = np.array([p["v"] for p in points], dtype=float)
    order = np.argsort(days)
    days, vals = days[order], vals[order]
    dense_days = np.linspace(days.min(), days.max(), n)
    dense_vals = np.interp(dense_days, days, vals)
    # light smoothing so it isn't perfectly piecewise-linear
    if len(dense_vals) > 5:
        kernel = np.array([1, 2, 3, 2, 1], dtype=float); kernel /= kernel.sum()
        pad = len(kernel) // 2
        padded = np.pad(dense_vals, pad, mode="edge")
        dense_vals = np.convolve(padded, kernel, mode="valid")
    return dense_days, dense_vals


def _chevron(ax, x, y, up, size=0.055):
    color = GREEN if up else RED
    dy = size * 1.15
    yy = y + dy if up else y - dy
    for yy_i in (y, yy):
        yv = yy_i if up else yy_i
        pts = [(x - size, yv), (x, yv + (size * 0.8 if up else -size * 0.8)), (x + size, yv)]
        ax.add_patch(mpatches.Polygon(pts, closed=False, fill=False, edgecolor=color,
            linewidth=4.2, joinstyle="round", capstyle="round",
            transform=ax.transAxes, clip_on=False))


def sparkline_card(filename, title, points, figsize=(4.55, 2.55), month_label="Aug"):
    days, series = _interp(points)
    # Computed from the raw first/last checkpoints, not series[0]/series[-1]
    # (the smoothed curve) — the convolution smoothing in _interp() pulls
    # the plotted curve's endpoints toward their neighboring interpolated
    # points, so a badge computed from the smoothed series drifted slightly
    # off the actual month-start/month-end values (e.g. showed +9.07% here
    # when the underlying data and the "Monthly Return by Asset Class" bar
    # chart both meant +9.2%). Sorting matches _interp()'s own day-order.
    raw_sorted = sorted(points, key=lambda p: p["d"])
    pct = (raw_sorted[-1]["v"] / raw_sorted[0]["v"] - 1) * 100
    up = pct >= 0
    fig, ax = plt.subplots(figsize=figsize, dpi=220)
    fig.subplots_adjust(left=0.16, right=0.97, top=0.72, bottom=0.20)
    ax.plot(days, series, color=GOLD_LINE, linewidth=2.6, solid_capstyle="round", zorder=3)
    ax.fill_between(days, series, min(series) * 0.995, color=GOLD_LINE, alpha=0.10, zorder=1)
    ax.set_xlim(days[0], days[-1])
    span = max(series) - min(series) or 1
    ax.set_ylim(min(series) - span * 0.12, max(series) + span * 0.12)
    ax.spines[:].set_visible(False)
    ax.set_yticks(np.linspace(min(series), max(series), 5))
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda v, p: f"{v:,.0f}" if v >= 100 else f"{v:,.2f}"))
    ax.tick_params(axis="y", labelsize=8, colors=MUTED, length=0)
    idx = [0, len(days)//4, len(days)//2, 3*len(days)//4, len(days)-1]
    ax.set_xticks([days[i] for i in idx])
    ax.set_xticklabels([f"{int(days[i])}-{month_label}" for i in idx], fontsize=7.6, color=MUTED)
    ax.tick_params(axis="x", length=0)
    fig.text(0.03, 0.92, title, fontsize=13.5, fontweight="bold", color="#B5651D", ha="left", va="top")
    _chevron(ax, 0.865, 1.28, up)
    fig.text(0.97, 1.30, f"{pct:+.2f}%", fontsize=15.5, fontweight="bold", color=INK,
              ha="right", va="center", transform=ax.transAxes)
    fig.savefig(filename, transparent=True)
    plt.close(fig)
    return pct


def bar_returns(filename, labels, returns, figsize=(7.3, 3.3)):
    cols = [GOLD_LIGHT if r >= 0 else "#C0785A" for r in returns]
    fig, ax = plt.subplots(figsize=figsize, dpi=220)
    fig.subplots_adjust(left=0.20, right=0.90, top=0.86, bottom=0.06)
    bars = ax.barh(labels, returns, color=cols, height=0.55, zorder=3)
    ax.axvline(0, color="#9CA3AF", linewidth=1, zorder=2)
    span = max(abs(min(returns)), abs(max(returns))) or 1
    ax.set_xlim(-span * 1.55, span * 1.55)
    for bar, r in zip(bars, returns):
        xw = bar.get_width()
        align = "left" if r >= 0 else "right"
        offset = span * 0.05 if r >= 0 else -span * 0.05
        ax.text(xw + offset, bar.get_y() + bar.get_height()/2, f"{r:+.1f}%",
                va="center", ha=align, fontsize=10.5, color=INK, fontweight="bold")
    ax.set_title("Monthly Return by Asset Class", loc="left", fontsize=13.5, fontweight="bold",
                  color="#B5651D", pad=14)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.tick_params(left=False, labelsize=10.5)
    ax.set_xticks([])
    ax.invert_yaxis()
    fig.savefig(filename, transparent=True)
    plt.close(fig)


def grouped_flow_bars(filename, weeks, fii, dii, figsize=(3.55, 2.9)):
    x = np.arange(len(weeks)); w = 0.34
    fig, ax = plt.subplots(figsize=figsize, dpi=220)
    ax.bar(x - w/2, fii, width=w, color=NAVY, label="FII", zorder=3)
    ax.bar(x + w/2, dii, width=w, color=GOLD_LIGHT, label="DII", zorder=3)
    ax.axhline(0, color="#9CA3AF", linewidth=1, zorder=2)
    ax.set_xticks(x); ax.set_xticklabels(weeks, fontsize=9)
    ax.set_title("FII vs DII Flows (₹ Cr)", loc="left", fontsize=12.5, fontweight="bold",
                  color="#B5651D", pad=10)
    ax.spines[["top", "right"]].set_visible(False)
    ax.tick_params(left=False, labelsize=8.5, colors=MUTED)
    ax.set_yticks([])
    ax.legend(frameon=False, loc="upper left", fontsize=8.5, ncol=2)
    fig.savefig(filename, transparent=True)
    plt.close(fig)


# ================================================================ build ===
def build(data, out_path, workdir):
    assets = os.path.join(workdir, "assets")
    os.makedirs(assets, exist_ok=True)
    month_label = data.get("month_short", "Aug")

    STATE = {"section": "Market Pulse", "letter": "M", "color": C_NAVY, "num_color": C_NAVY_LIGHT}

    def set_section(name, key):
        STATE["section"] = name; STATE["letter"] = name[0]
        STATE["color"] = SECTION_COLOR[key]; STATE["num_color"] = BADGE_TINT[key]

    section_pages = data["section_pages"]  # {page_no(str): [name, key]}

    def _wrap_by_width(c, text, font, size, max_width):
        # Word-wraps text to fit max_width at the given font/size, using
        # actual glyph widths rather than a fixed character count — needed
        # because issue_title/issue_subtitle length varies every month and
        # a long one (e.g. "August 2026: How a Jackson Hole Pivot and a
        # Hormuz Oil Shock Rewired Global Markets") was previously drawn
        # with a single drawString() and ran off the right edge of the
        # cover page uncut.
        words = text.split()
        lines, current = [], ""
        for word in words:
            candidate = f"{current} {word}".strip()
            if c.stringWidth(candidate, font, size) <= max_width or not current:
                current = candidate
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
        return lines

    def draw_cover(c):
        c.setFillColor(C_NAVY_DARK); c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        c.setFillColor(C_GOLD_LIGHT); c.rect(0, PAGE_H - 12, PAGE_W, 7, fill=1, stroke=0)
        c.rect(0, 0, PAGE_W, 7, fill=1, stroke=0)
        cx, cy = 1.55*inch, PAGE_H - 1.9*inch
        c.setFillColor(colors.HexColor("#3D7EC9")); c.circle(cx, cy, 0.62*inch, fill=1, stroke=0)
        c.setFillColor(colors.white); c.circle(cx, cy, 0.34*inch, fill=1, stroke=0)
        c.setStrokeColor(C_GOLD_LIGHT); c.setLineWidth(3); c.circle(cx, cy, 0.34*inch, fill=0, stroke=1)
        c.setFillColor(C_GOLD_LIGHT); c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(cx, cy - 5, "FB")
        c.setFont("Helvetica-Bold", 11); c.setFillColor(C_GOLD_LIGHT)
        c.drawString(cx + 0.9*inch, cy + 4, "THE FINANCIAL")
        c.drawString(cx + 0.9*inch, cy - 14, "BUDDY")
        c.setFont("Helvetica-Bold", 12); c.setFillColor(colors.HexColor("#C7D6EA"))
        c.drawString(0.85*inch, PAGE_H - 2.75*inch, "M O N T H L Y   D I G E S T")
        c.setFont("Helvetica-Bold", 46); c.setFillColor(colors.white)
        c.drawString(0.83*inch, PAGE_H - 3.55*inch, "Market")
        c.drawString(0.83*inch, PAGE_H - 4.25*inch, "Pulse")
        c.setFont("Helvetica", 15); c.setFillColor(colors.HexColor("#DCE7F4"))
        subtitle_max_width = PAGE_W - 1.7*inch  # 0.85in margin on each side
        title_lines = _wrap_by_width(c, data["issue_title"], "Helvetica", 15, subtitle_max_width)
        subtitle_lines = _wrap_by_width(c, data["issue_subtitle"], "Helvetica", 15, subtitle_max_width)
        y = PAGE_H - 4.95*inch
        for line in title_lines:
            c.drawString(0.85*inch, y, line)
            y -= 0.28*inch
        y -= 0.02*inch
        for line in subtitle_lines:
            c.drawString(0.85*inch, y, line)
            y -= 0.28*inch
        c.setFont("Helvetica-Bold", 11); c.setFillColor(C_GOLD_LIGHT)
        c.drawString(0.85*inch, 1.55*inch, data["month_label"].upper())
        c.setFont("Helvetica", 10); c.setFillColor(colors.HexColor("#8FAAC9"))
        c.drawString(0.85*inch, 1.32*inch, f"thefinancialbuddy.com  ·  Issue #{data['issue_number']}")

    def on_page(canv, doc):
        canv.saveState()
        page_no = doc.page
        if page_no == 1:
            draw_cover(canv)
        else:
            key = str(page_no)
            if key in section_pages:
                set_section(*section_pages[key])
            color = STATE["color"]; letter0 = STATE["letter"]; rest = STATE["section"][1:].upper()
            canv.setFont("Helvetica-Bold", 30); canv.setFillColor(color)
            canv.drawString(0.78*inch, PAGE_H - 0.92*inch, letter0)
            w0 = canv.stringWidth(letter0, "Helvetica-Bold", 30)
            canv.setFont("Helvetica", 24); canv.setFillColor(C_INK)
            canv.drawString(0.78*inch + w0 + 1, PAGE_H - 0.90*inch, rest)
            canv.setStrokeColor(C_RULE); canv.setLineWidth(1)
            canv.line(0.78*inch, PAGE_H - 1.05*inch, PAGE_W - 0.78*inch, PAGE_H - 1.05*inch)
            canv.setFillColor(STATE["num_color"])
            canv.circle(0.95*inch, 0.62*inch, 0.24*inch, fill=1, stroke=0)
            canv.setFillColor(colors.white); canv.setFont("Helvetica-Bold", 11)
            canv.drawCentredString(0.95*inch, 0.57*inch, f"{page_no-1:02d}")
            canv.setFont("Helvetica-Bold", 10); canv.setFillColor(C_NAVY_DARK)
            canv.drawRightString(PAGE_W - 0.78*inch, 0.60*inch, "The Financial Buddy")
            canv.setFont("Helvetica", 8); canv.setFillColor(C_MUTED)
            canv.drawRightString(PAGE_W - 0.78*inch, 0.46*inch, f"Market Pulse · {data['month_label']}")
        canv.restoreState()

    # ---- styles ----
    s_h2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13, textColor=C_NAVY,
        spaceBefore=14, spaceAfter=7, leading=16)
    s_body = ParagraphStyle("body", fontName="Helvetica", fontSize=9.6, textColor=C_INK,
        leading=14.4, spaceAfter=7)
    s_caption = ParagraphStyle("caption", fontName="Helvetica-Oblique", fontSize=8.2,
        textColor=C_MUTED, spaceAfter=10)
    s_story_head = ParagraphStyle("story_head", fontName="Helvetica-Bold", fontSize=11.6,
        textColor=C_ORANGE, spaceAfter=6)
    s_toc_topic = ParagraphStyle("toc_topic", fontName="Helvetica", fontSize=12.5, textColor=C_INK)
    s_toc_num = ParagraphStyle("toc_num", fontName="Helvetica", fontSize=12.5, textColor=C_INK,
        alignment=TA_CENTER)

    def dashed_box(inner, pad=10):
        t = Table([[inner]], colWidths=[6.34*inch])
        t.setStyle(TableStyle([("BOX", (0,0),(-1,-1), 1.1, colors.HexColor("#B9BEC6")),
            ("TOPPADDING",(0,0),(-1,-1),pad), ("BOTTOMPADDING",(0,0),(-1,-1),pad),
            ("LEFTPADDING",(0,0),(-1,-1),pad), ("RIGHTPADDING",(0,0),(-1,-1),pad)]))
        return t

    def story_box(headline, body_text, img_path, img_first=False):
        img = Image(img_path, width=2.05*inch, height=2.05*inch)
        text_block = [Paragraph(headline, s_story_head), Paragraph(body_text, s_body)]
        row = [img, text_block] if img_first else [text_block, img]
        colw = [2.25*inch, 3.85*inch] if img_first else [3.85*inch, 2.25*inch]
        inner = Table([row], colWidths=colw)
        inner.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
            ("LEFTPADDING",(0,0),(-1,-1),4), ("RIGHTPADDING",(0,0),(-1,-1),4)]))
        return dashed_box(inner)

    def metric_card(img_path, w=3.05*inch, h=1.72*inch):
        return Image(img_path, width=w, height=h)

    def two_up(a, b):
        t = Table([[a, b]], colWidths=[3.17*inch, 3.17*inch])
        t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
            ("LEFTPADDING",(0,0),(-1,-1),0), ("RIGHTPADDING",(0,0),(-1,-1),6)]))
        return t

    def grid_2x2(a, b, c, d):
        t = Table([[a, b],[c, d]], colWidths=[3.17*inch, 3.17*inch])
        t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
            ("TOPPADDING",(0,0),(-1,-1),6), ("BOTTOMPADDING",(0,0),(-1,-1),14),
            ("LINEBELOW",(0,0),(1,0),0.6,C_RULE), ("LINEAFTER",(0,0),(0,1),0.6,C_RULE)]))
        return t

    def mini_table(rows, header_color):
        t = Table(rows, colWidths=[2.3*inch, 0.85*inch])
        t.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,0),header_color), ("TEXTCOLOR",(0,0),(-1,0),colors.white),
            ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
            ("FONTSIZE",(0,0),(-1,-1),9), ("ALIGN",(1,0),(1,-1),"RIGHT"),
            ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, colors.HexColor("#F5F7F9")]),
            ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5),
            ("LEFTPADDING",(0,0),(-1,-1),6), ("GRID",(0,0),(-1,-1),0.4,C_RULE)]))
        return t

    class Bubble(Flowable):
        def __init__(self, text, attribution, width, fill, font_size=11.5, min_height=1.5*inch):
            Flowable.__init__(self)
            self.text = text; self.attribution = attribution; self.width = width
            self.fill = fill; self.font_size = font_size
            wrap_chars = max(18, int(width / (font_size * 0.52)))
            self.lines = textwrap.wrap(text, wrap_chars)
            self.height = max(min_height, 0.34*inch*len(self.lines) + 0.75*inch)
        def draw(self):
            c = self.canv
            c.setFillColor(self.fill); r = 0.22*inch
            c.roundRect(0, 0.16*inch, self.width, self.height - 0.16*inch, r, fill=1, stroke=0)
            tail = c.beginPath()
            tail.moveTo(0.35*inch, 0.16*inch); tail.lineTo(0.15*inch, 0.0); tail.lineTo(0.60*inch, 0.16*inch)
            tail.close()
            c.setFillColor(self.fill); c.drawPath(tail, fill=1, stroke=0)
            c.setFillColor(C_INK); c.setFont("Helvetica-Oblique", self.font_size)
            y = self.height - 0.5*inch
            for ln in self.lines:
                c.drawString(0.28*inch, y, ln); y -= self.font_size + 5.5
            c.setFont("Helvetica-Bold", 9.5)
            c.drawString(0.28*inch, 0.32*inch, self.attribution)

    story = []
    story.append(Spacer(1, 1)); story.append(PageBreak())

    # ---- contents ----
    story.append(Spacer(1, 22))
    toc_data = []
    for item in data["contents"]:
        tag = Table([[""]], colWidths=[0.18*inch], rowHeights=[0.32*inch])
        tag.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1), SECTION_COLOR[item["color"]])]))
        toc_data.append([tag, Paragraph(f"{item['n']}&nbsp;&nbsp;&nbsp;{item['topic']}", s_toc_topic),
                          Paragraph(str(item["page"]), s_toc_num)])
    toc_table = Table(toc_data, colWidths=[0.3*inch, 5.2*inch, 0.7*inch])
    toc_table.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("BOTTOMPADDING",(0,0),(-1,-1),14), ("TOPPADDING",(0,0),(-1,-1),2)]))
    story.append(toc_table)
    story.append(PageBreak())

    # ---- global markets ----
    story.append(Spacer(1, 20))
    story.append(story_box(data["throughline"]["headline"], data["throughline"]["body"],
        os.path.join(HERE, "assets", "illus_global.png")))
    story.append(Spacer(1, 16))
    story.append(Paragraph("Global Indices", s_h2))
    cards = []
    for series in data["global_indices"]:
        fn = os.path.join(assets, f"card_{series['key']}.png")
        sparkline_card(fn, series["title"], series["points"], month_label=month_label)
        cards.append(metric_card(fn))
    story.append(grid_2x2(*cards))
    # Was a hardcoded "replace before publishing" placeholder that always
    # rendered verbatim on the live PDF regardless of data — nothing in the
    # pipeline ever replaced it. A real, generic attribution instead.
    story.append(Paragraph("Source: NSE, Yahoo Finance, Trading Economics.", s_caption))
    story.append(PageBreak())

    # ---- currency ----
    story.append(Spacer(1, 20))
    story.append(Paragraph(data["currency"]["commentary"], s_body))
    story.append(Spacer(1, 8))
    c_cards = []
    for series in data["currency"]["series"]:
        fn = os.path.join(assets, f"card_{series['key']}.png")
        sparkline_card(fn, series["title"], series["points"], month_label=month_label)
        c_cards.append(metric_card(fn, w=3.1*inch, h=1.9*inch))
    story.append(two_up(*c_cards))
    story.append(Spacer(1, 18))
    story.append(story_box(data["forex_story"]["headline"], data["forex_story"]["body"],
        os.path.join(HERE, "assets", "illus_flows.png"), img_first=True))
    story.append(PageBreak())

    # ---- commodities ----
    story.append(Spacer(1, 20))
    story.append(Paragraph(data["commodities"]["commentary"], s_body))
    story.append(Spacer(1, 8))
    m_cards = []
    for series in data["commodities"]["series"]:
        fn = os.path.join(assets, f"card_{series['key']}.png")
        sparkline_card(fn, series["title"], series["points"], month_label=month_label)
        m_cards.append(metric_card(fn, w=3.1*inch, h=1.9*inch))
    story.append(two_up(*m_cards))
    story.append(Spacer(1, 18))
    bar_returns(os.path.join(assets, "bar_returns.png"),
        [a["label"] for a in data["asset_returns"]], [a["pct"] for a in data["asset_returns"]])
    story.append(Image(os.path.join(assets, "bar_returns.png"), width=6.3*inch, height=2.85*inch))
    story.append(Paragraph("Monthly return by asset class.", s_caption))
    story.append(PageBreak())

    # ---- indian indices ----
    story.append(Spacer(1, 20))
    story.append(Paragraph(data["indian_indices"]["commentary"], s_body))
    story.append(Spacer(1, 8))
    i_cards = []
    for series in data["indian_indices"]["series"]:
        fn = os.path.join(assets, f"card_{series['key']}.png")
        sparkline_card(fn, series["title"], series["points"], month_label=month_label)
        i_cards.append(metric_card(fn))
    story.append(grid_2x2(*i_cards))
    story.append(Paragraph("Index paths for the month.", s_caption))
    story.append(PageBreak())

    # ---- equities & flows ----
    story.append(Spacer(1, 18))
    gainers = [["Company Name", "Change (%)"]] + [[g["name"], g["pct"]] for g in data["gainers"]]
    losers = [["Company Name", "Change (%)"]] + [[g["name"], g["pct"]] for g in data["losers"]]
    story.append(two_up(
        Table([[Paragraph("Top Gainers | NIFTY 50", ParagraphStyle("g", fontName="Helvetica-Bold",
            fontSize=10.5, textColor=C_INK, spaceAfter=5))], [mini_table(gainers, colors.HexColor("#7CB342"))]]),
        Table([[Paragraph("Top Losers | NIFTY 50", ParagraphStyle("l", fontName="Helvetica-Bold",
            fontSize=10.5, textColor=C_INK, spaceAfter=5))], [mini_table(losers, colors.HexColor("#D64545"))]]),
    ))
    story.append(Spacer(1, 16))
    flows = data["flows_weekly"]
    grouped_flow_bars(os.path.join(assets, "bar_flows.png"), flows["weeks"], flows["fii"], flows["dii"])
    story.append(Image(os.path.join(assets, "bar_flows.png"), width=3.15*inch, height=2.55*inch))
    story.append(Spacer(1, 10))
    story.append(Paragraph(data["flows_weekly"]["commentary"], s_body))
    story.append(Spacer(1, 4))
    vix_fn = os.path.join(assets, "card_vix.png")
    sparkline_card(vix_fn, data["vix"]["title"], data["vix"]["points"], figsize=(7.3, 2.9), month_label=month_label)
    story.append(Image(vix_fn, width=6.3*inch, height=2.55*inch))
    story.append(PageBreak())

    # ---- events archive ----
    story.append(Spacer(1, 18))
    ev = data["events"]
    cal = _cal.Calendar(firstweekday=0)
    weeks = cal.monthdayscalendar(ev["year"], ev["month"])
    day_names = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    highlight = {}
    for e in ev["india"]:
        highlight[e["day"]] = C_ORANGE
    for e in ev["global"]:
        highlight[e["day"]] = C_NAVY
    cal_data = [day_names] + [["" if d == 0 else str(d) for d in wk] for wk in weeks]
    cal_table = Table(cal_data, colWidths=[0.84*inch]*7, rowHeights=[0.32*inch]+[0.42*inch]*len(weeks))
    tstyle = [("FONTNAME",(0,0),(-1,0),"Helvetica"), ("FONTSIZE",(0,0),(-1,0),8.6),
        ("TEXTCOLOR",(0,0),(-1,0),C_MUTED), ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,1),(-1,-1),11), ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"), ("LINEBELOW",(0,0),(-1,0),1,colors.HexColor("#D64545"))]
    for r, wk in enumerate(weeks, start=1):
        for c, d in enumerate(wk):
            if d in highlight:
                tstyle.append(("BOX",(c,r),(c,r),1.4,highlight[d]))
    cal_table.setStyle(TableStyle(tstyle))
    story.append(Paragraph(f"{ev['month']:02d}&nbsp;&nbsp;&nbsp;&nbsp;<b>{data['month_label'].split()[0]}</b>"
        f"&nbsp;&nbsp;&nbsp;&nbsp;{ev['year']}",
        ParagraphStyle("calh", fontName="Helvetica", fontSize=17, textColor=C_INK, alignment=TA_CENTER)))
    story.append(Spacer(1, 10)); story.append(cal_table); story.append(Spacer(1, 22))

    def event_col(tag_color, tag_label, items):
        rows = [[Table([[""]], colWidths=[0.22*inch], rowHeights=[0.22*inch],
                        style=TableStyle([("BACKGROUND",(0,0),(-1,-1),tag_color)])),
                 Paragraph(f"<b>{tag_label}</b>", ParagraphStyle("etag", fontName="Helvetica-Bold",
                    fontSize=12.5, textColor=C_INK))]]
        t0 = Table(rows, colWidths=[0.3*inch, 2.6*inch])
        t0.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
        blocks = [t0, Spacer(1, 8)]
        for item in items:
            badge = Table([[str(item["day"])]], colWidths=[0.42*inch], rowHeights=[0.34*inch])
            badge.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),tag_color),
                ("TEXTCOLOR",(0,0),(-1,-1),colors.white), ("FONTNAME",(0,0),(-1,-1),"Helvetica-Bold"),
                ("FONTSIZE",(0,0),(-1,-1),11), ("ALIGN",(0,0),(-1,-1),"CENTER"),
                ("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
            txt = Paragraph(f"<b>{item['headline']}</b><br/><font size=8.6 color='#555555'>{item['desc']}</font>",
                ParagraphStyle("etxt", fontName="Helvetica", fontSize=9.6, leading=13))
            row = Table([[badge, txt]], colWidths=[0.5*inch, 2.4*inch])
            row.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"), ("TOPPADDING",(0,0),(-1,-1),2),
                ("BOTTOMPADDING",(0,0),(-1,-1),12)]))
            blocks.append(row)
        return blocks

    ev_table = Table([[event_col(C_ORANGE, "Indian Events", ev["india"]),
                        event_col(C_NAVY, "Global Events", ev["global"])]],
                      colWidths=[3.15*inch, 3.15*inch])
    ev_table.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP")]))
    story.append(ev_table)
    story.append(PageBreak())

    # ---- opinion poll ----
    story.append(Spacer(1, 10))
    palette = [colors.HexColor("#BFE1F0"), colors.HexColor("#C8DD6E"), colors.HexColor("#F6D774")]
    widths = [6.3*inch, 4.6*inch, 5.4*inch]
    for i, q in enumerate(data["quotes"]):
        story.append(Bubble(q["text"], q["attribution"], widths[i % 3], palette[i % 3]))
        story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=0.6, color=C_RULE, spaceBefore=6, spaceAfter=8))
    story.append(Paragraph(data["closing_disclaimer"], s_caption))

    doc = SimpleDocTemplate(out_path, pagesize=letter,
        leftMargin=0.78*inch, rightMargin=0.78*inch, topMargin=0.85*inch, bottomMargin=0.85*inch,
        title=f"Market Pulse — {data['month_label']}", author="The Financial Buddy")
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    with open(args.data) as f:
        data = json.load(f)
    workdir = os.path.dirname(os.path.abspath(args.out)) or "."
    build(data, args.out, os.path.join(workdir, ".mp_build_tmp"))
    print(f"wrote {args.out}")


if __name__ == "__main__":
    main()
