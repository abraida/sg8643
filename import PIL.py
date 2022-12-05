from PIL import Image

img = Image.open('res/window.png', 'r')
has_alpha = img.mode == 'RGBA'

alpha = img.split()[-1]

print(list(alpha.getdata())[0:100])