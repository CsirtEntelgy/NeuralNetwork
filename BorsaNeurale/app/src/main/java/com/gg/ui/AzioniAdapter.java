package com.gg.ui;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.gg.borsaneurale.R;
import com.gg.persistence.Azione;
import com.gg.persistence.CSVReader;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class AzioniAdapter extends BaseAdapter {
    public List<Azione> azioni = new ArrayList<>();
    private Context context = null;
    private SimpleDateFormat simple = new SimpleDateFormat("dd/MM", Locale.ITALIAN);

    public AzioniAdapter(Context context) {
        this.context = context;
        load(context);
    }

    public void load(Context ctx) {
        CSVReader csvReader = new CSVReader(ctx);
        List<String[]> rows = null;
        azioni = new ArrayList<>();
        try {
            rows = csvReader.readFileCSV("mappa_borsa.csv");
            for (int i = 0; i < rows.size(); i++) {
                String[] azione = rows.get(i);
                if (azione.length == 6) {
                    Azione az = new Azione((long) i + 1, azione);
                    azioni.add(az);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public int getCount() {
        return azioni.size();
    }

    @Override
    public Object getItem(int position) {
        return azioni.get(position);
    }

    @Override
    public long getItemId(int position) {
        return azioni.get(position).id;
    }

    @Override
    public View getView(int position, View v, ViewGroup vg) {
        if (v == null) {
            v = LayoutInflater.from(context).inflate(R.layout.azione_row, null);
        }
        Azione ai = (Azione) getItem(position);
        TextView txt = v.findViewById(R.id.az_name);
        txt.setText(ai.name);
        return v;
    }

}
