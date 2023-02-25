package com.gg.persistence;

import static android.os.Environment.DIRECTORY_DOWNLOADS;

import android.os.Environment;

public class DatabaseStrings {
    public static final String TBL_NAME = "Borsa";
    public static final String FIELD_ID = "_id";
    public static final String FIELD_AZIONE = "Azione";
    public static final String FIELD_DETTAGLIO = "Dettaglio";
    public static final String FIELD_SIGLA = "Sigla";
    public static final String FIELD_FILENAME = "NomeFile";

    public static final String TBL_NAME_AZIONI = "Azioni";
    public static final String FIELD_ID_AZIONE = "idAzione";
    public static final String FIELD_DATA = "Data";
    public static final String FIELD_APERTURA = "Apertura";
    public static final String FIELD_MASSIMO = "Massimo";
    public static final String FIELD_MINIMO = "Minimo";
    public static final String FIELD_ULTIMOVALORE = "Valore";
    public static final String FIELD_VARIAZIONEPERCENTUALE = "Perc";
    public static final String FIELD_ULTIMOAGGIORNAMENTO = "UltimoAggiornamento";
    public static final String FIELD_ABILITATA = "Abilitata";

    public static String dbPath = Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS).getAbsolutePath() + java.io.File.separator + "NeuralNetwork" + java.io.File.separator;
    public static String extPath = dbPath + "data";

}