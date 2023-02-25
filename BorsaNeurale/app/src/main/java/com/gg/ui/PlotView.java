package com.gg.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

import com.gg.persistence.Pair;

import java.util.ArrayList;
import java.util.List;


public class PlotView extends View {
    static private Paint paintRed = new Paint();
    static private Paint paintBlack = new Paint();
    static private Paint paintGray = new Paint();

    static {
        paintRed.setAntiAlias(true);
        paintRed.setColor(Color.RED);
        paintRed.setStyle(Paint.Style.STROKE);
        paintBlack.setAntiAlias(true);
        paintBlack.setColor(Color.BLACK);
        paintBlack.setStyle(Paint.Style.STROKE);
        paintBlack.setTextSize(30.0F);
        paintGray.setAntiAlias(true);
        paintGray.setColor(Color.GRAY);
        paintGray.setStyle(Paint.Style.STROKE);
    }

    List<Pair> points = new ArrayList<>();

    public PlotView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public PlotView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setPoints(List<Pair> dati) {
        points = dati;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int n = points.size();
        if (n == 0) return;
        int xoff = 30;
        int yoff = 30;
        int w = canvas.getWidth() - xoff * 2;
        int h = canvas.getHeight() - yoff * 2;
        double alfa = h / (Pair.minv - Pair.maxv);
        double beta = -alfa * Pair.maxv;
        double xold = xoff + 0.0;
        Pair p = points.get(0);
        double yold = yoff + alfa * p.value + beta;
        for (int i = 1; i < n; i++) {
            p = points.get(i);
            double y = yoff + alfa * p.value + beta;
            double x = xoff + w * i / n;
            canvas.drawLine((float) xold, (float) yold, (float) x, (float) y, paintRed);
            xold = x;
            yold = y;
        }
        canvas.drawLine(xoff, yoff, xoff, yoff + h, paintBlack);
        canvas.drawLine(xoff, yoff + h, xoff + w, yoff + h, paintBlack);
        canvas.drawLine(xoff + w, yoff + h, xoff + w, yoff, paintBlack);
        canvas.drawLine(xoff + w, yoff, xoff, yoff, paintBlack);
        int delta = n / 5;
        for (int i = delta / 2; i < n; i += delta) {
            p = points.get(i);
            float y = 2 * yoff + h;
            float x = xoff + w * (i - delta / 2) / n;
            canvas.drawText(p.data, x, y, paintBlack);
            x = xoff + w * (i) / n;
            canvas.drawLine(x, y - 16, x, y - 16 - 35, paintBlack);
            canvas.drawLine(x, y - 16, x, yoff, paintGray);
        }

    }

    public void addPoint(String s1, float s2) {
        points.add(new Pair(s1, s2));
    }

}
