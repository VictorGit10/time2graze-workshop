"""Lift the Time2Graze wordmark off the slide screenshot it arrived on.

The screenshot is flat: one background (#171717), one white and one olive
green (#4C631F), with nothing but antialiasing in between. So each pixel can
be read as the background plus some coverage of one ink, and that coverage
becomes alpha. The white ink is then re-laid in the mark's own dark, because
the institutions band is white and the reversed wordmark would be invisible
on it; the green is carried over untouched.

Run from the repository root:

    python research/logos/time2graze-extract.py
"""

import numpy as np
from PIL import Image

SOURCE = 'research/logos/time2graze-slide-source.png'
TARGET = 'public/logos/institutions/time2graze.png'

BG = np.array([23, 23, 23], float)
WHITE = np.array([255, 255, 255], float)
GREEN = np.array([76, 99, 31], float)
DARK = np.array([23, 23, 23], float)

image = np.asarray(Image.open(SOURCE).convert('RGB'), dtype=float)
offset = image - BG


def coverage(ink):
    """How much of `ink` this pixel holds, and how badly that reading fits."""
    axis = ink - BG
    amount = np.clip((offset @ axis) / (axis @ axis), 0, 1)
    residue = np.linalg.norm(offset - amount[..., None] * axis, axis=-1)
    return amount, residue


white_amount, white_residue = coverage(WHITE)
green_amount, green_residue = coverage(GREEN)

green = green_residue < white_residue
alpha = np.where(green, green_amount, white_amount)
rgb = np.where(green[..., None], GREEN, DARK)

mark = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA')

# Cropped to its ink, like every other asset here: data/institutions.ts
# scales the marks by the artwork's own dimensions, not by a canvas.
rows, columns = np.nonzero(alpha > 0.02)
mark = mark.crop((columns.min(), rows.min(), columns.max() + 1, rows.max() + 1))
mark.save(TARGET, optimize=True)

print(f'{TARGET}: {mark.size[0]} x {mark.size[1]}')
