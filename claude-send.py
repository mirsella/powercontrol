#!/usr/bin/env python3

import struct
import time
import sys

# Key mapping (very basic)
KEY_MAPPING = {
    "a": 0x04,
    "b": 0x05,
    "c": 0x06,
    "d": 0x07,
    "e": 0x08,
    "f": 0x09,
    "g": 0x0A,
    "h": 0x0B,
    "i": 0x0C,
    "j": 0x0D,
    "k": 0x0E,
    "l": 0x0F,
    "m": 0x10,
    "n": 0x11,
    "o": 0x12,
    "p": 0x13,
    "q": 0x14,
    "r": 0x15,
    "s": 0x16,
    "t": 0x17,
    "u": 0x18,
    "v": 0x19,
    "w": 0x1A,
    "x": 0x1B,
    "y": 0x1C,
    "z": 0x1D,
    "1": 0x1E,
    "2": 0x1F,
    "3": 0x20,
    "4": 0x21,
    "5": 0x22,
    "6": 0x23,
    "7": 0x24,
    "8": 0x25,
    "9": 0x26,
    "0": 0x27,
    "\n": 0x28,
    " ": 0x2C,
}

# Path to the HID device file
HID_DEVICE = "/dev/hidg0"


def send_string(text):
    with open(HID_DEVICE, "wb+") as fd:
        for char in text:
            if char.lower() in KEY_MAPPING:
                key_code = KEY_MAPPING[char.lower()]

                # Handle uppercase letters with shift
                if char.isupper():
                    # Shift key (left shift) = 0x02
                    fd.write(struct.pack("8B", 0x02, 0, key_code, 0, 0, 0, 0, 0))
                else:
                    fd.write(struct.pack("8B", 0, 0, key_code, 0, 0, 0, 0, 0))

                # Release all keys
                fd.write(struct.pack("8B", 0, 0, 0, 0, 0, 0, 0, 0))

                # Small delay between keystrokes
                time.sleep(0.01)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_string(" ".join(sys.argv[1:]))
    else:
        print("Usage: send_keys.py <text to send>")
