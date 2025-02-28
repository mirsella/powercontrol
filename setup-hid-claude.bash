#!/bin/bash

# Stop the script if any command fails
set -e

echo "Setting up USB Keyboard Gadget..."

# Reset USB gadget (if exists)
if [ -d /sys/kernel/config/usb_gadget/keyboard ]; then
	echo "Removing existing gadget..."
	cd /sys/kernel/config/usb_gadget/keyboard
	if [ -f UDC ]; then
		echo "" >UDC
	fi
	cd ..
	rmdir keyboard
fi

# Ensure modules are loaded
modprobe libcomposite
modprobe dwc2

# Create gadget directory
cd /sys/kernel/config/usb_gadget/
mkdir -p keyboard
cd keyboard

# Configure gadget
echo 0x1d6b >idVendor  # Linux Foundation
echo 0x0104 >idProduct # Multifunction Composite Gadget
echo 0x0100 >bcdDevice # v1.0.0
echo 0x0200 >bcdUSB    # USB2

# Create English locale
mkdir -p strings/0x409
echo "fedcba9876543210" >strings/0x409/serialnumber
echo "Raspberry Pi" >strings/0x409/manufacturer
echo "USB Keyboard" >strings/0x409/product

# Create HID function
mkdir -p functions/hid.usb0
echo 1 >functions/hid.usb0/protocol
echo 1 >functions/hid.usb0/subclass
echo 8 >functions/hid.usb0/report_length

# Write HID report descriptor (keyboard)
echo -ne \\x05\\x01\\x09\\x06\\xa1\\x01\\x05\\x07\\x19\\xe0\\x29\\xe7\\x15\\x00\\x25\\x01\\x75\\x01\\x95\\x08\\x81\\x02\\x95\\x01\\x75\\x08\\x81\\x03\\x95\\x05\\x75\\x01\\x05\\x08\\x19\\x01\\x29\\x05\\x91\\x02\\x95\\x01\\x75\\x03\\x91\\x03\\x95\\x06\\x75\\x08\\x15\\x00\\x25\\x65\\x05\\x07\\x19\\x00\\x29\\x65\\x81\\x00\\xc0 >functions/hid.usb0/report_desc

# Create configuration
mkdir -p configs/c.1/strings/0x409
echo "Config 1: HID Keyboard" >configs/c.1/strings/0x409/configuration
echo 250 >configs/c.1/MaxPower

# Link HID function to configuration
ln -s functions/hid.usb0 configs/c.1/

# Find the USB Device Controller
UDC=$(ls /sys/class/udc)
if [ -z "$UDC" ]; then
	echo "No UDC found! USB OTG might not be available."
	exit 1
fi

# Enable gadget
echo "Activating gadget with UDC: $UDC"
echo $UDC >UDC

# Ensure device permissions are correct
if [ -e /dev/hidg0 ]; then
	echo "Setting permissions for /dev/hidg0"
	chmod 666 /dev/hidg0
else
	echo "Warning: /dev/hidg0 not found after gadget setup!"
fi

echo "USB Keyboard Gadget setup complete!"
