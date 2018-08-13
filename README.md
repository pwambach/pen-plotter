# Pen plotter

Some code to create and send lines to a pen plotters using [grbl](https://github.com/grbl/grbl).
Note that everything here is a first draft and needs more structure and stavility.

The produced gcode commands are meant to work with my eleksdraw pen plotter. To use this with other plotters the code may need some adjustments.


## Useful commands

connect directly from terminal:

`npx serialport-term -p /dev/tty.wchusbserial1440 -b 115200 --echo`
