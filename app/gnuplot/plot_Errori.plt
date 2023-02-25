#set term canvas standalone mousing jsdir "http://localhost:8069"
#set output 'myplot.html'
set terminal svg size 500,362 
set title 'Errori apprendirmento'
set datafile sep ","
set xlabel 'iterazione'
set grid
plot [][0:] '-' u 1:2 with line notitle
