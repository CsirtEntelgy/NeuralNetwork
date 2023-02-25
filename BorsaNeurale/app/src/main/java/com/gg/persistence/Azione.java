package com.gg.persistence;

import android.content.Context;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Azione {
    public final static HashMap<String, Azione> mappaAzioni = new HashMap<String, Azione>();
    public final String name;
    public final long id;
    public String dettaglio;
    public String sigla;
    public String filename;
    public String abilitata;
    public String ultimoAggiornamento;
    public List<String[]> dati = new ArrayList<>();

    public Azione(Long id, String[] azione) {
        this.id = id;
        this.name = azione[0];
        this.dettaglio = azione[1];
        this.sigla = azione[2];
        this.filename = azione[3];
        this.ultimoAggiornamento = azione[4];
        this.abilitata = azione[5];
        mappaAzioni.put(name, this);
    }

    public void loadDati(Context ctx) {
        try {
            CSVReader reader = new CSVReader(ctx);
            dati = reader.readFileSDCSV(this.filename + ".csv");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Pair> getDati() {
        List<Pair> pp = new ArrayList<>();
        for (int i = 0; i < dati.size(); i++) {
            String[] dato = dati.get(i);
            pp.add(new Pair(dato[0], Float.parseFloat((dato[1]))));
        }
        return pp;
    }

    public String toString() {
        return this.name;
    }
}
