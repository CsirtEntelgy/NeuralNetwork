#set term canvas standalone mousing jsdir "http://localhost:8069"
#set output 'myplot.html'
set terminal svg size 500,362 
set title 'Dati storici'
set datafile sep ","
set xdata time
set xlabel 'Data'
set ylabel 'Valore'
set timefmt "%Y-%m-%d"
set format x "%b"
set grid
plot [][0:] '-' u 1:2 with line title "ultimo Valore"
