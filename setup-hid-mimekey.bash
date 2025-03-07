#!/usr/bin/env bash

# from https://github.com/mtlynch/key-mime-pi

if [ -z "$BASH_VERSION" ]; then
	echo must be run in bash
	exit
fi

# Exit on first error.
set -e

# Treat undefined environment variables as errors.
set -u

[ -c /dev/hidg0 ] && echo device already created && exit

modprobe libcomposite

cd /sys/kernel/config/usb_gadget/
mkdir -p g1
cd g1

echo 0x1d6b >idVendor  # Linux Foundation
echo 0x0104 >idProduct # Multifunction Composite Gadget
echo 0x0100 >bcdDevice # v1.0.0
echo 0x0200 >bcdUSB    # USB2

STRINGS_DIR="strings/0x409"
mkdir -p "$STRINGS_DIR"
echo "6b65796d696d6570690" >"${STRINGS_DIR}/serialnumber"
echo "powercontrol" >"${STRINGS_DIR}/manufacturer"
echo "Generic USB Keyboard" >"${STRINGS_DIR}/product"

FUNCTIONS_DIR="functions/hid.usb0"
mkdir -p "$FUNCTIONS_DIR"
echo 1 >"${FUNCTIONS_DIR}/protocol" # Keyboard
echo 0 >"${FUNCTIONS_DIR}/subclass" # No subclass
echo 8 >"${FUNCTIONS_DIR}/report_length"
# Write the report descriptor
# Source: https://www.kernel.org/doc/html/latest/usb/gadget_hid.html
echo -ne \\x05\\x01\\x09\\x06\\xa1\\x01\\x05\\x07\\x19\\xe0\\x29\\xe7\\x15\\x00\\x25\\x01\\x75\\x01\\x95\\x08\\x81\\x02\\x95\\x01\\x75\\x08\\x81\\x03\\x95\\x05\\x75\\x01\\x05\\x08\\x19\\x01\\x29\\x05\\x91\\x02\\x95\\x01\\x75\\x03\\x91\\x03\\x95\\x06\\x75\\x08\\x15\\x00\\x25\\x65\\x05\\x07\\x19\\x00\\x29\\x65\\x81\\x00\\xc0 >"${FUNCTIONS_DIR}/report_desc"

CONFIG_INDEX=1
CONFIGS_DIR="configs/c.${CONFIG_INDEX}"
mkdir -p "$CONFIGS_DIR"
echo 250 >"${CONFIGS_DIR}/MaxPower"

CONFIGS_STRINGS_DIR="${CONFIGS_DIR}/strings/0x409"
mkdir -p "$CONFIGS_STRINGS_DIR"
echo "Config ${CONFIG_INDEX}: ECM network" >"${CONFIGS_STRINGS_DIR}/configuration"

ln -s "$FUNCTIONS_DIR" "${CONFIGS_DIR}/"
ls /sys/class/udc >UDC

chmod 777 /dev/hidg0
