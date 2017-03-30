import cv2
import time
import numpy
# Camera 0 is the integrated web cam on my netbook
camera_port = 0
 
#Number of frames to throw away while the camera adjusts to light levels
ramp_frames = 30
 
# Now we can initialize the camera capture object with the cv2.VideoCapture class.
# All it needs is the index to a camera port.
camera = cv2.VideoCapture(camera_port)
 
# Captures a single image from the camera and returns it in PIL format
def get_image():
 # read is the easiest way to get a full image out of a VideoCapture object.
 retval, im = camera.read()
 return im
 
# Ramp the camera - these frames will be discarded and are only used to allow v4l2
# to adjust light levels, if necessary
for i in xrange(ramp_frames):
 temp = get_image()
while(True):
    print("Taking image...")
    # Take the actual image we want to keep
    camera_capture = get_image()
    file = "/home/car/test_image.png"
    
    # A nice feature of the imwrite method is that it will automatically choose the
    # correct format based on the file extension you provide. Convenient!
    cv2.imwrite(file, camera_capture)
     
    # You'll want to release the camera, otherwise you won't be able to create a new
    # capture object until your script exits
    #del(camera)
    im = camera_capture
    print(im.shape)
    height, width, channel = im.shape
    cv2.imshow('image color', im)
    # im2 = im
    # cv2.imshow('image', im)
    ifilter = 170
    im[im >= ifilter]= 255
    im[im < ifilter] = 0
    r,g,b = im[395,330]
    if( g == 255 or g == 255 and b == 255):
        print("This might be green!")
    print(im[395,330])
    
    for x in range(300,310): 
        for y in range(325,335): 
            im[x,y] = 200
        for y in range(475,485):
            im[x,y] = 200
        for y in range(175,185):
            im[x,y] = 200
            
    for x in range(390,400): 
        for y in range(325,335): 
            im[x,y] = 125
        for y in range(475,485):
            im[x,y] = 200
        for y in range(175,185):
            im[x,y] = 200
    #im.save("/home/pi/Desktop/filteredimg.jpeg")
    from PIL import Image
    img =Image.fromarray(im)
    img.save("/home/pi/Desktop/filteredimg.jpeg")
    cv2.imshow('image color removal', im)
    
    #time.sleep(5)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
