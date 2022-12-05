from PIL import Image

img = Image.open('res/castle.png', 'r')
has_alpha = img.mode == 'RGBA'

alpha = img.split()[-1]

print(list(alpha.getdata()))