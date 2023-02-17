#!/bin/sh

# original script modified for led off functionality only
# requires compiling your own copy of coreboot ectools

# SPDX-License-Identifier: Apache-2.0
# Copyright (C) 2023-present Fewtarius

#
# A simple tool to manipulate the controller LEDs using ectool, thanks to
# Maya (https://github.com/Maccraft123) for reverse engineering.
#
# Schema:
#
# 0x6d - LED PWM control (0x03)
#
# 0xb1 - Support for 4 zones and RGB color
#
#   RGB colors:
#
#   1 - Red
#   2 - Green
#   3 - Blue
#
#   Zones:
#
#   Right (2), Down (5), Left (8) , Up (11)
#
#   Note: Set 0xb1 to 02 for off.
#
# 0xb2 - Sets brightness, requires b1 to be set at the same time.
#
#   00-ff - brightness from 0-255.  Not noticeable to me above 128.
#
# 0xbf - Set expected mode
#
#   0x10 - Enable
#   0xe2 - Tint (+ Red for Purple, + Green for Teal)
#   0xe3-0e5 - Tint + blink (unused)
#
#   0xff - Close channel
#

. /etc/profile

ECTOOL="/home/gamer/.local/bin/ectool"
DEBUG=false

function ec_writecmd() {
  sudo ${ECTOOL} -w 0x6d -z 0x03 >/dev/null 2>&1
}

function mode() {
  sudo ${ECTOOL} -w 0xbf -z ${1} >/dev/null 2>&1
  sudo ${ECTOOL} -w 0xbf -z ff >/dev/null 2>&1
}

ec_writecmd
for twice in 1 2
do
  ### RGB off command
  sudo ${ECTOOL} -w 0xb1 -z 0x02 >/dev/null 2>&1
  sudo ${ECTOOL} -w 0xb2 -z 0xc0 >/dev/null 2>&1
  mode 0x10
done
