---
title: "IIT Delhi Students Build India's First Working Indigenous Micro-GPU"
date: "2026-09-24T14:29:10.950Z"
category: "Technology"
description: "Two M.Tech students at IIT Delhi have demonstrated India's first working, indigenously designed micro graphics processor, a step toward cutting the country's reliance on imported display chips."
author: "The Financial Buddy Team"
shortSummary: "Researchers at IIT Delhi's Electrical Engineering department have built and demonstrated India's first working, indigenously designed micro-GPU, mapped onto an FPGA chip. Led by M.Tech students Nammi Akash and M. Ravi Teja, the project targets affordable embedded displays like e-rickshaw dashboards and low-cost HMIs, with an 8-16 core version and a path to silicon planned next."
---

Researchers at IIT Delhi announced on Thursday that they have designed and demonstrated India's first working, indigenously built micro graphics processing unit, a small but symbolically significant step for a country that imports almost every GPU used in its electronics today, from smartphones to industrial displays.

## What the team built

The project was led by two M.Tech students in the Electrical Engineering department, Nammi Akash and M. Ravi Teja, working under the supervision of Professor Jayadeva and Professor Kaushik Saha. The team designed a custom floating-point graphics engine written entirely in Register Transfer Language, the low-level hardware description format engineers use to specify how a chip's circuits behave, and mapped it onto a Spartan-7 Field Programmable Gate Array, a reconfigurable chip that can be programmed to imitate custom hardware without the cost of fabricating actual silicon.

In a statement, the researchers said that to the best of their knowledge, this is the first working, demonstrable micro-GPU designed indigenously by any university in India. The distinction matters: India has talked for years about building domestic chip capability, but most of that conversation has centred on manufacturing capacity and foreign partnerships rather than home-grown processor design reaching a working, demonstrable stage.

## Where a chip like this would actually be used

This is not a processor aimed at gaming laptops or data centres. The architecture is built as a scalable, programmable graphics IP meant for lightweight embedded applications: industrial control-panel displays, low-cost human-machine interfaces, dashboard navigation systems for e-rickshaws, inland-waterway navigation terminals for small fishing boats, and e-book readers for education. These are exactly the categories of devices that currently rely on imported graphics chips even when the rest of the product is assembled in India, making them a sensible first target for a young, domestically designed architecture that has not yet been proven at scale.

The design can be mapped either to programmable hardware like FPGAs, as the team has already shown, or eventually to a dedicated ASIC, a chip fabricated specifically for this one purpose rather than reconfigured in software.

## What comes next

The IIT Delhi team said its next milestone is an 8-to-16-core vector-style graphics processor, paired with an optimised compiler and a graphics software toolchain, the layer of code that lets developers actually write programs for the new chip rather than working directly in hardware description language. Beyond that, the group is targeting a proof-of-concept run on a 65-nanometre ASIC manufacturing process, a relatively mature and inexpensive fabrication node compared with the cutting-edge processes used for flagship smartphone or AI chips.

## Why it fits a bigger push

The announcement lands in the same week that Prime Minister Narendra Modi inaugurated SEMICON India 2026 in New Delhi, an industry event that drew nearly 600 companies from 52 countries and has been framed by the government as proof that India's semiconductor ambitions are moving from policy announcements to actual production lines. A university-built, working micro-GPU is a far smaller achievement than a commercial fabrication plant, but it signals that the base of engineering talent capable of designing chips, not just assembling or testing them, is growing inside India's academic institutions.

Whether this specific design ever reaches a commercial product is a separate question from whether it succeeds as a proof of concept. For now, it stands as an early marker of what indigenous graphics silicon designed and demonstrated in an Indian lab actually looks like, several years before any of it could plausibly show up inside a consumer device.

This is an original summary based on public reporting. See our [editorial policy](/editorial-policy) for how we source, write, and correct our stories.
