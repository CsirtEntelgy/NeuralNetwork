package com.gg.persistence;

public class Pair {
    public static float minv = 10000000000.0F;
    public static float maxv = -100000000000.0F;
    public String data;
    public float value;

    public Pair(String data, float value) {
        this.data = data;
        this.value = value;
        if (minv > this.value) minv = this.value;
        if (maxv < this.value) maxv = this.value;
    }
}
