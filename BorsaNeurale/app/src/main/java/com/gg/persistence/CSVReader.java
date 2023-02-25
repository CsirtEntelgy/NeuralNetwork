package com.gg.persistence;

import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CSVReader {
    Context context;
    List<String[]> rows = new ArrayList<>();

    public CSVReader(Context context) {
        this.context = context;
    }

    public List<String[]> readCSV(int resourceName) throws IOException {
        Resources r = context.getResources();
        Log.d(this.getClass().getName(), "File:" + r.getResourceName(resourceName));
        InputStream is = r.openRawResource(resourceName);
        return _readCSV(is);
    }

    public List<String[]> readFileCSV(String filename) throws IOException {
        AssetManager assetManager = context.getAssets();
        InputStream is = assetManager.open(filename);
        return _readCSV(is);
    }

    public List<String[]> readFileSDCSV(String filename) throws IOException {
        File initialFile = new File(com.gg.persistence.DatabaseStrings.extPath, filename);
        Log.d(this.getClass().getName(), "File:" + initialFile.getAbsolutePath());
        InputStream targetStream = new FileInputStream(initialFile);
        return _readCSV(targetStream);
    }

    public List<String[]> readFileGDCSV(String filename) throws IOException {
        File initialFile = new File(filename);
        Log.d(this.getClass().getName(), "File:" + initialFile.getAbsolutePath());
        InputStream targetStream = new FileInputStream(initialFile);
        return _readCSV(targetStream);
    }

    private List<String[]> _readCSV(InputStream is) throws IOException {
        InputStreamReader isr = new InputStreamReader(is);
        BufferedReader br = new BufferedReader(isr);
        String line;
        String csvSplitBy = ";";
        br.readLine();
        while ((line = br.readLine()) != null) {
            Log.d(this.getClass().getName(), "Lettura " + line);
            String[] row = line.split(csvSplitBy);
            rows.add(row);
        }
        Log.d("CsvReader", "Lette " + rows.size() + " righe");
        return rows;
    }
}