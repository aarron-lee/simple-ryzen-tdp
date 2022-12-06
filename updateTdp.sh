#!/bin/bash

# ryzenadj
# a = TDP
# b = boost
# c = slowTDP

RYZENADJ_PATH=$1
TDP=$2
BOOST_TDP=$3

echo $RYZENADJ_PATH
echo $TDP
echo $BOOST_TDP

sudo $RYZENADJ_PATH -a $TDP -b $BOOST_TDP -c $TDP