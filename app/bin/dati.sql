CREATE TABLE BORSA(ID_AZIENDA INT PRIMARY KEY, AZIENDA TEXT, DETTAGLIO TEXT, SIGLA TEXT);
CREATE TABLE STATO(ID_AZIENDA INTEGER PRIMARY KEY REFERENCES BORSA(ID_AZIENDA), ULTIMOAGGIORNAMENTO TEXT, ABILITATA BOOLEAN);
CREATE TABLE DATI (ID_AZIENDA INTEGER, DATA TEXT, APERTURA TEXT, MASSIMO TEXT, MINIMO TEXT, ULTIMOVALORE TEXT, ADJ TEXT, VOLUME TEXT, PRIMARY KEY(ID_AZIENDA, DATA));
CREATE VIEW STATOAZIONI AS
  SELECT
    B.ID_AZIENDA                         ID_AZIENDA,
    B.AZIENDA                            AZIENDA,
    B.DETTAGLIO                          DETTAGLIO,
    B.SIGLA                              SIGLA,
    S.ULTIMOAGGIORNAMENTO                ULTIMOAGGIORNAMENTO,
    S.ABILITATA                          ABILITATA,
    B.DATI                               DATI
  FROM
    MAPPA B,
    STATO S
  WHERE
    S.ID_AZIENDA=B.ID_AZIENDA;
CREATE VIEW AZIONE AS
  SELECT
    B.ID_AZIENDA                         ID_AZIENDA,
    AZIENDA,
    DETTAGLIO,
    SIGLA,
    DATA,
    APERTURA,
    MASSIMO,
    MINIMO,
    ULTIMOVALORE,
    VARIAZIONEPERCENTUALE,
    VOLUME
  FROM
    BORSA B
    JOIN DATI D
    ON D.ID_AZIENDA=B.ID_AZIENDA;
CREATE VIEW TREND AS
  SELECT
    ID_AZIENDA,
    DATA,
    APERTURA,
    MASSIMO,
    MINIMO,
    ULTIMOVALORE,
    ADJ,
    VOLUME,
    (ULTIMOVALORE-APERTURA)/ULTIMOVALORE VARIAZIONEPERCENTUALE
  FROM
    DATI
/* TREND(ID_AZIENDA,DATA,APERTURA,MASSIMO,MINIMO,ULTIMOVALORE,ADJ,VOLUME,VARIAZIONEPERCENTUALE) */;
CREATE TRIGGER TRG_AGGIORNAMENTO INSTEAD OF
  UPDATE OF ULTIMOAGGIORNAMENTO,
  ABILITATA ON STATOAZIONI BEGIN
  UPDATE STATO
  SET
    ULTIMOAGGIORNAMENTO=NEW.ULTIMOAGGIORNAMENTO,
    ABILITATA=NEW.ABILITATA
  WHERE
    ID_AZIENDA IN (
      SELECT ID_AZIENDA FROM BORSA WHERE SIGLA=OLD.SIGLA
    );
END;
PRAGMA FOREIGN_KEYS=OFF;

BEGIN
  TRANSACTION;
  INSERT INTO BORSA VALUES(
    1,
    'A.B.P. Nocivelli',
    'A.B.P. Nocivelli',
    'ABP.MI'
  );
  INSERT INTO BORSA VALUES(
    2,
    'A2a',
    'A2a',
    'A2A.MI'
  );
  INSERT INTO BORSA VALUES(
    3,
    'Aegon',
    'Aegon',
    'AGN.MI'
  );
  INSERT INTO BORSA VALUES(
    4,
    'Cir',
    'Cir',
    ''
  );
  INSERT INTO BORSA VALUES(
    5,
    'Circle',
    'Circle',
    'CIRC.MI'
  );
  INSERT INTO BORSA VALUES(
    6,
    'Civitanavi Systems',
    'Civitanavi Systems',
    'CNS.MI'
  );
  INSERT INTO BORSA VALUES(
    7,
    'Clabo',
    'Clabo',
    'CLA.MI'
  );
  INSERT INTO BORSA VALUES(
    8,
    'Class Editori',
    'Class Editori',
    'CLE.MI'
  );
  INSERT INTO BORSA VALUES(
    9,
    'Cleanbnb',
    'Cleanbnb',
    'CBB.MI'
  );
  INSERT INTO BORSA VALUES(
    10,
    'Cnh Industrial',
    'Cnh Industrial',
    'CNHI.MI'
  );
  INSERT INTO BORSA VALUES(
    11,
    'Cofle',
    'Cofle',
    'CFL.MI'
  );
  INSERT INTO BORSA VALUES(
    12,
    'Coinbase Global',
    'Coinbase Global',
    ''
  );
  INSERT INTO BORSA VALUES(
    13,
    'Comal',
    'Comal',
    'CML.MI'
  );
  INSERT INTO BORSA VALUES(
    14,
    'Aeroporto Guglielmo Marconi Di Bologna',
    'Aeroporto Guglielmo Marconi Di Bologna',
    'ADB.MI'
  );
  INSERT INTO BORSA VALUES(
    15,
    'Comer Industries',
    'Comer Industries',
    'COM.MI'
  );
  INSERT INTO BORSA VALUES(
    16,
    'Commerzbank',
    'Commerzbank',
    ''
  );
  INSERT INTO BORSA VALUES(
    17,
    'Compagnia Dei Caraibi',
    'Compagnia Dei Caraibi',
    '1TIME.MI'
  );
  INSERT INTO BORSA VALUES(
    18,
    'Conafi',
    'Conafi',
    'CNF.MI'
  );
  INSERT INTO BORSA VALUES(
    19,
    'Confinvest',
    'Confinvest',
    'CFV.MI'
  );
  INSERT INTO BORSA VALUES(
    20,
    'Continental',
    'Continental',
    ''
  );
  INSERT INTO BORSA VALUES(
    21,
    'Convergenze',
    'Convergenze',
    'CVG.MI'
  );
  INSERT INTO BORSA VALUES(
    22,
    'Copernico',
    'Copernico',
    'COP.MI'
  );
  INSERT INTO BORSA VALUES(
    23,
    'Cover 50',
    'Cover 50',
    'COV.MI'
  );
  INSERT INTO BORSA VALUES(
    24,
    'Covivio',
    'Covivio',
    'CVO.MI'
  );
  INSERT INTO BORSA VALUES(
    25,
    'Agatos',
    'Agatos',
    'AGA.MI'
  );
  INSERT INTO BORSA VALUES(
    26,
    'Credit Agricole',
    'Credit Agricole',
    'ACA.MI'
  );
  INSERT INTO BORSA VALUES(
    27,
    'Credito Emiliano',
    'Credito Emiliano',
    ''
  );
  INSERT INTO BORSA VALUES(
    28,
    'Crowdfundme',
    'Crowdfundme',
    'CFM.MI'
  );
  INSERT INTO BORSA VALUES(
    29,
    'Csp Int Ind Calze',
    'Csp Int Ind Calze',
    'CSP.MI'
  );
  INSERT INTO BORSA VALUES(
    30,
    'Culti Milano',
    'Culti Milano',
    'CULT.MI'
  );
  INSERT INTO BORSA VALUES(
    31,
    'Cy4gate',
    'Cy4gate',
    'CY4.MI'
  );
  INSERT INTO BORSA VALUES(
    32,
    'Cyberoo',
    'Cyberoo',
    'CYB.MI'
  );
  INSERT INTO BORSA VALUES(
    33,
    'D''Amico',
    'D''Amico',
    'DIS.MI'
  );
  INSERT INTO BORSA VALUES(
    34,
    'Danieli & C',
    'Danieli & C',
    'DAN.MI'
  );
  INSERT INTO BORSA VALUES(
    35,
    'Danieli & C Rsp',
    'Danieli & C Rsp',
    ''
  );
  INSERT INTO BORSA VALUES(
    36,
    'Agatos 4,75% Cv 2017-2026',
    'Agatos 4,75% Cv 2017-2026',
    ''
  );
  INSERT INTO BORSA VALUES(
    37,
    'Datalogic',
    'Datalogic',
    'DAL.MI'
  );
  INSERT INTO BORSA VALUES(
    38,
    'Datrix',
    'Datrix',
    'DATA.MI'
  );
  INSERT INTO BORSA VALUES(
    39,
    'Dba Group',
    'Dba Group',
    'DBA.MI'
  );
  INSERT INTO BORSA VALUES(
    40,
    'De''Longhi',
    'De''Longhi',
    'DLG.MI'
  );
  INSERT INTO BORSA VALUES(
    41,
    'Dea Capital',
    'Dea Capital',
    'DEA.MI'
  );
  INSERT INTO BORSA VALUES(
    42,
    'Defence Tech Holding',
    'Defence Tech Holding',
    'DTH.MI'
  );
  INSERT INTO BORSA VALUES(
    43,
    'Deodato.Gallery',
    'Deodato.Gallery',
    'ART.MI'
  );
  INSERT INTO BORSA VALUES(
    44,
    'Destination Italia',
    'Destination Italia',
    'DIT.MI'
  );
  INSERT INTO BORSA VALUES(
    45,
    'Deutsche Bank',
    'Deutsche Bank',
    ''
  );
  INSERT INTO BORSA VALUES(
    46,
    'Deutsche Boerse',
    'Deutsche Boerse',
    ''
  );
  INSERT INTO BORSA VALUES(
    47,
    'Ageas',
    'Ageas',
    'AGS.MI'
  );
  INSERT INTO BORSA VALUES(
    48,
    'Deutsche Lufthansa',
    'Deutsche Lufthansa',
    'LHA.DE'
  );
  INSERT INTO BORSA VALUES(
    49,
    'Deutsche Post',
    'Deutsche Post',
    ''
  );
  INSERT INTO BORSA VALUES(
    50,
    'Deutsche Telekom',
    'Deutsche Telekom',
    'DTE.DE'
  );
  INSERT INTO BORSA VALUES(
    51,
    'Dhh',
    'Dhh',
    'DHH.MI'
  );
  INSERT INTO BORSA VALUES(
    52,
    'Diasorin',
    'Diasorin',
    'DIA.MI'
  );
  INSERT INTO BORSA VALUES(
    53,
    'Digital Bros',
    'Digital Bros',
    'DIB.MI'
  );
  INSERT INTO BORSA VALUES(
    54,
    'Digital Magics',
    'Digital Magics',
    'DM.MI'
  );
  INSERT INTO BORSA VALUES(
    55,
    'Digital Value',
    'Digital Value',
    'DGV.MI'
  );
  INSERT INTO BORSA VALUES(
    56,
    'Digital360',
    'Digital360',
    'DIG.MI'
  );
  INSERT INTO BORSA VALUES(
    57,
    'Digitouch',
    'Digitouch',
    'DGT.MI'
  );
  INSERT INTO BORSA VALUES(
    58,
    'Cia',
    'Cia',
    ''
  );
  INSERT INTO BORSA VALUES(
    59,
    'Directa Sim',
    'Directa Sim',
    'D.MI'
  );
  INSERT INTO BORSA VALUES(
    60,
    'Dotstay',
    'Dotstay',
    'DOT.MI'
  );
  INSERT INTO BORSA VALUES(
    61,
    'Dovalue',
    'Dovalue',
    'DOV.MI'
  );
  INSERT INTO BORSA VALUES(
    62,
    'Doxee',
    'Doxee',
    ''
  );
  INSERT INTO BORSA VALUES(
    63,
    'E.On',
    'E.On',
    ''
  );
  INSERT INTO BORSA VALUES(
    64,
    'Ecosuntek',
    'Ecosuntek',
    ''
  );
  INSERT INTO BORSA VALUES(
    65,
    'Ediliziacrobatica',
    'Ediliziacrobatica',
    ''
  );
  INSERT INTO BORSA VALUES(
    66,
    'Edison Rsp',
    'Edison Rsp',
    ''
  );
  INSERT INTO BORSA VALUES(
    67,
    'Eems',
    'Eems',
    ''
  );
  INSERT INTO BORSA VALUES(
    68,
    'El.En.',
    'El.En.',
    ''
  );
  INSERT INTO BORSA VALUES(
    69,
    'Air France-Klm',
    'Air France-Klm',
    'AF.MI'
  );
  INSERT INTO BORSA VALUES(
    70,
    'Eles',
    'Eles',
    ''
  );
  INSERT INTO BORSA VALUES(
    71,
    'Elica',
    'Elica',
    ''
  );
  INSERT INTO BORSA VALUES(
    72,
    'Emak',
    'Emak',
    ''
  );
  INSERT INTO BORSA VALUES(
    73,
    'Enav',
    'Enav',
    ''
  );
  INSERT INTO BORSA VALUES(
    74,
    'Enel',
    'Enel',
    'ENEL.MI'
  );
  INSERT INTO BORSA VALUES(
    75,
    'Energy',
    'Energy',
    ''
  );
  INSERT INTO BORSA VALUES(
    76,
    'Enervit',
    'Enervit',
    ''
  );
  INSERT INTO BORSA VALUES(
    77,
    'Engie',
    'Engie',
    ''
  );
  INSERT INTO BORSA VALUES(
    78,
    'Eni',
    'Eni',
    'ENI.MI'
  );
  INSERT INTO BORSA VALUES(
    79,
    'Eprice',
    'Eprice',
    ''
  );
  INSERT INTO BORSA VALUES(
    80,
    'Airbus',
    'Airbus',
    'AIR.MI'
  );
  INSERT INTO BORSA VALUES(
    81,
    'Equita Group',
    'Equita Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    82,
    'Erg',
    'Erg',
    ''
  );
  INSERT INTO BORSA VALUES(
    83,
    'Erredue',
    'Erredue',
    ''
  );
  INSERT INTO BORSA VALUES(
    84,
    'Esautomotion',
    'Esautomotion',
    ''
  );
  INSERT INTO BORSA VALUES(
    85,
    'Esi',
    'Esi',
    ''
  );
  INSERT INTO BORSA VALUES(
    86,
    'Esprinet',
    'Esprinet',
    ''
  );
  INSERT INTO BORSA VALUES(
    87,
    'Essilorluxottica',
    'Essilorluxottica',
    ''
  );
  INSERT INTO BORSA VALUES(
    88,
    'Estrima',
    'Estrima',
    ''
  );
  INSERT INTO BORSA VALUES(
    89,
    'Eukedos',
    'Eukedos',
    ''
  );
  INSERT INTO BORSA VALUES(
    90,
    'Eurogroup Laminations',
    'Eurogroup Laminations',
    ''
  );
  INSERT INTO BORSA VALUES(
    91,
    'Ala',
    'Ala',
    ''
  );
  INSERT INTO BORSA VALUES(
    92,
    'Eurotech',
    'Eurotech',
    ''
  );
  INSERT INTO BORSA VALUES(
    93,
    'Eviso',
    'Eviso',
    ''
  );
  INSERT INTO BORSA VALUES(
    94,
    'Evonik Industries',
    'Evonik Industries',
    ''
  );
  INSERT INTO BORSA VALUES(
    95,
    'Expert.Ai',
    'Expert.Ai',
    ''
  );
  INSERT INTO BORSA VALUES(
    96,
    'Exprivia',
    'Exprivia',
    ''
  );
  INSERT INTO BORSA VALUES(
    97,
    'Fae Technology',
    'Fae Technology',
    ''
  );
  INSERT INTO BORSA VALUES(
    98,
    'Farmacosmo',
    'Farmacosmo',
    ''
  );
  INSERT INTO BORSA VALUES(
    99,
    'Farmae',
    'Farmae',
    ''
  );
  INSERT INTO BORSA VALUES(
    100,
    'Faurecia',
    'Faurecia',
    ''
  );
  INSERT INTO BORSA VALUES(
    101,
    'Fenix Entertainment',
    'Fenix Entertainment',
    ''
  );
  INSERT INTO BORSA VALUES(
    102,
    'Alerion Cleanpower',
    'Alerion Cleanpower',
    'ARN.MI'
  );
  INSERT INTO BORSA VALUES(
    103,
    'Ferrari',
    'Ferrari',
    ''
  );
  INSERT INTO BORSA VALUES(
    104,
    'Fervi',
    'Fervi',
    ''
  );
  INSERT INTO BORSA VALUES(
    105,
    'Fidia',
    'Fidia',
    ''
  );
  INSERT INTO BORSA VALUES(
    106,
    'Fiera Milano',
    'Fiera Milano',
    ''
  );
  INSERT INTO BORSA VALUES(
    107,
    'Fila',
    'Fila',
    ''
  );
  INSERT INTO BORSA VALUES(
    108,
    'Finanza.Tech',
    'Finanza.Tech',
    ''
  );
  INSERT INTO BORSA VALUES(
    109,
    'Fincantieri',
    'Fincantieri',
    ''
  );
  INSERT INTO BORSA VALUES(
    110,
    'Fine Foods & Pharmaceuticals Ntm',
    'Fine Foods & Pharmaceuticals Ntm',
    ''
  );
  INSERT INTO BORSA VALUES(
    111,
    'Finecobank',
    'Finecobank',
    ''
  );
  INSERT INTO BORSA VALUES(
    112,
    'Finlogic',
    'Finlogic',
    ''
  );
  INSERT INTO BORSA VALUES(
    113,
    'ABC Company S.p.A.',
    'ABC Company S.p.A.',
    'ABC.MI'
  );
  INSERT INTO BORSA VALUES(
    114,
    'Alfio Bardolla',
    'Alfio Bardolla',
    'ABTG.MI'
  );
  INSERT INTO BORSA VALUES(
    115,
    'First Capital',
    'First Capital',
    ''
  );
  INSERT INTO BORSA VALUES(
    116,
    'First Capital 3,75% Cv 2019-2026',
    'First Capital 3,75% Cv 2019-2026',
    ''
  );
  INSERT INTO BORSA VALUES(
    117,
    'Fnm',
    'Fnm',
    ''
  );
  INSERT INTO BORSA VALUES(
    118,
    'Fope',
    'Fope',
    ''
  );
  INSERT INTO BORSA VALUES(
    119,
    'Fos',
    'Fos',
    ''
  );
  INSERT INTO BORSA VALUES(
    120,
    'Franchetti',
    'Franchetti',
    ''
  );
  INSERT INTO BORSA VALUES(
    121,
    'Franchi Umberto Marmi',
    'Franchi Umberto Marmi',
    ''
  );
  INSERT INTO BORSA VALUES(
    122,
    'Frendy Energy',
    'Frendy Energy',
    ''
  );
  INSERT INTO BORSA VALUES(
    123,
    'Fresenius',
    'Fresenius',
    ''
  );
  INSERT INTO BORSA VALUES(
    124,
    'Fresenius Medical Care',
    'Fresenius Medical Care',
    ''
  );
  INSERT INTO BORSA VALUES(
    125,
    'Alfonsino',
    'Alfonsino',
    'ALF.MI'
  );
  INSERT INTO BORSA VALUES(
    126,
    'Friulchem',
    'Friulchem',
    ''
  );
  INSERT INTO BORSA VALUES(
    127,
    'G Rent',
    'G Rent',
    ''
  );
  INSERT INTO BORSA VALUES(
    128,
    'G.M. Leather',
    'G.M. Leather',
    ''
  );
  INSERT INTO BORSA VALUES(
    129,
    'Gabetti',
    'Gabetti',
    ''
  );
  INSERT INTO BORSA VALUES(
    130,
    'Gambero Rosso',
    'Gambero Rosso',
    ''
  );
  INSERT INTO BORSA VALUES(
    131,
    'Garofalo Health Care',
    'Garofalo Health Care',
    ''
  );
  INSERT INTO BORSA VALUES(
    132,
    'Gas Plus',
    'Gas Plus',
    ''
  );
  INSERT INTO BORSA VALUES(
    133,
    'Gefran',
    'Gefran',
    ''
  );
  INSERT INTO BORSA VALUES(
    134,
    'Gel',
    'Gel',
    ''
  );
  INSERT INTO BORSA VALUES(
    135,
    'Generalfinance',
    'Generalfinance',
    ''
  );
  INSERT INTO BORSA VALUES(
    136,
    'Algowatt',
    'Algowatt',
    'ALW.MI'
  );
  INSERT INTO BORSA VALUES(
    137,
    'Generali Ass',
    'Generali Ass',
    'G.MI'
  );
  INSERT INTO BORSA VALUES(
    138,
    'Gentili Mosconi',
    'Gentili Mosconi',
    ''
  );
  INSERT INTO BORSA VALUES(
    139,
    'Geox',
    'Geox',
    ''
  );
  INSERT INTO BORSA VALUES(
    140,
    'Gequity',
    'Gequity',
    ''
  );
  INSERT INTO BORSA VALUES(
    141,
    'Gibus',
    'Gibus',
    ''
  );
  INSERT INTO BORSA VALUES(
    142,
    'Giglio Group',
    'Giglio Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    143,
    'Giglio.Com',
    'Giglio.Com',
    ''
  );
  INSERT INTO BORSA VALUES(
    144,
    'Gilead Sciences',
    'Gilead Sciences',
    ''
  );
  INSERT INTO BORSA VALUES(
    145,
    'Gismondi 1754',
    'Gismondi 1754',
    ''
  );
  INSERT INTO BORSA VALUES(
    146,
    'Go Internet',
    'Go Internet',
    ''
  );
  INSERT INTO BORSA VALUES(
    147,
    'Alkemy',
    'Alkemy',
    'ALK.MI'
  );
  INSERT INTO BORSA VALUES(
    148,
    'Gpi',
    'Gpi',
    ''
  );
  INSERT INTO BORSA VALUES(
    149,
    'Greenthesis',
    'Greenthesis',
    ''
  );
  INSERT INTO BORSA VALUES(
    150,
    'Grifal',
    'Grifal',
    ''
  );
  INSERT INTO BORSA VALUES(
    151,
    'Growens',
    'Growens',
    ''
  );
  INSERT INTO BORSA VALUES(
    152,
    'Gvs',
    'Gvs',
    ''
  );
  INSERT INTO BORSA VALUES(
    153,
    'H-Farm',
    'H-Farm',
    'FARM.MI'
  );
  INSERT INTO BORSA VALUES(
    154,
    'Health Italia',
    'Health Italia',
    ''
  );
  INSERT INTO BORSA VALUES(
    155,
    'Heidelberg Cement',
    'Heidelberg Cement',
    ''
  );
  INSERT INTO BORSA VALUES(
    156,
    'Henkel Vz',
    'Henkel Vz',
    ''
  );
  INSERT INTO BORSA VALUES(
    157,
    'Hera',
    'Hera',
    ''
  );
  INSERT INTO BORSA VALUES(
    158,
    'Allcore',
    'Allcore',
    'CORE.MI'
  );
  INSERT INTO BORSA VALUES(
    159,
    'High Quality Food',
    'High Quality Food',
    ''
  );
  INSERT INTO BORSA VALUES(
    160,
    'I Grandi Viaggi',
    'I Grandi Viaggi',
    ''
  );
  INSERT INTO BORSA VALUES(
    161,
    'Iberdrola',
    'Iberdrola',
    ''
  );
  INSERT INTO BORSA VALUES(
    162,
    'Idntt',
    'Idntt',
    ''
  );
  INSERT INTO BORSA VALUES(
    163,
    'Iervolino & Lady Bacardi Entertainment',
    'Iervolino & Lady Bacardi Entertainment',
    ''
  );
  INSERT INTO BORSA VALUES(
    164,
    'Igd - Siiq',
    'Igd - Siiq',
    ''
  );
  INSERT INTO BORSA VALUES(
    165,
    'Il Sole 24 Ore',
    'Il Sole 24 Ore',
    ''
  );
  INSERT INTO BORSA VALUES(
    166,
    'Illa',
    'Illa',
    ''
  );
  INSERT INTO BORSA VALUES(
    167,
    'Illimity Bank',
    'Illimity Bank',
    ''
  );
  INSERT INTO BORSA VALUES(
    168,
    'Ilpra',
    'Ilpra',
    ''
  );
  INSERT INTO BORSA VALUES(
    169,
    'Allianz',
    'Allianz',
    'ALV.DE'
  );
  INSERT INTO BORSA VALUES(
    170,
    'Immsi',
    'Immsi',
    ''
  );
  INSERT INTO BORSA VALUES(
    171,
    'Impianti',
    'Impianti',
    ''
  );
  INSERT INTO BORSA VALUES(
    172,
    'Imprendiroma',
    'Imprendiroma',
    ''
  );
  INSERT INTO BORSA VALUES(
    173,
    'Imvest',
    'Imvest',
    ''
  );
  INSERT INTO BORSA VALUES(
    174,
    'Indel B',
    'Indel B',
    ''
  );
  INSERT INTO BORSA VALUES(
    175,
    'Inditex',
    'Inditex',
    ''
  );
  INSERT INTO BORSA VALUES(
    176,
    'Industrie Chimiche Forestali',
    'Industrie Chimiche Forestali',
    ''
  );
  INSERT INTO BORSA VALUES(
    177,
    'Industrie De Nora',
    'Industrie De Nora',
    ''
  );
  INSERT INTO BORSA VALUES(
    178,
    'Infineon Technologies',
    'Infineon Technologies',
    ''
  );
  INSERT INTO BORSA VALUES(
    179,
    'Ing Groep',
    'Ing Groep',
    ''
  );
  INSERT INTO BORSA VALUES(
    180,
    'Almawave',
    'Almawave',
    'AIW.MI'
  );
  INSERT INTO BORSA VALUES(
    181,
    'Iniziative Bresciane',
    'Iniziative Bresciane',
    ''
  );
  INSERT INTO BORSA VALUES(
    182,
    'Innovatec',
    'Innovatec',
    ''
  );
  INSERT INTO BORSA VALUES(
    183,
    'Intel',
    'Intel',
    ''
  );
  INSERT INTO BORSA VALUES(
    184,
    'Intercos',
    'Intercos',
    ''
  );
  INSERT INTO BORSA VALUES(
    185,
    'Intermonte Partners Sim',
    'Intermonte Partners Sim',
    ''
  );
  INSERT INTO BORSA VALUES(
    186,
    'International Care Company',
    'International Care Company',
    ''
  );
  INSERT INTO BORSA VALUES(
    187,
    'Interpump Group',
    'Interpump Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    188,
    'Intesa Sanpaolo',
    'Intesa Sanpaolo',
    'ISP.MI'
  );
  INSERT INTO BORSA VALUES(
    189,
    'Intred',
    'Intred',
    ''
  );
  INSERT INTO BORSA VALUES(
    190,
    'Inwit',
    'Inwit',
    ''
  );
  INSERT INTO BORSA VALUES(
    191,
    'Centrale Del Latte D''Italia',
    'Centrale Del Latte D''Italia',
    'CLI.MI'
  );
  INSERT INTO BORSA VALUES(
    192,
    'Irce',
    'Irce',
    ''
  );
  INSERT INTO BORSA VALUES(
    193,
    'Iren',
    'Iren',
    ''
  );
  INSERT INTO BORSA VALUES(
    194,
    'Iscc Fintech',
    'Iscc Fintech',
    ''
  );
  INSERT INTO BORSA VALUES(
    195,
    'It Way',
    'It Way',
    ''
  );
  INSERT INTO BORSA VALUES(
    196,
    'Italgas',
    'Italgas',
    ''
  );
  INSERT INTO BORSA VALUES(
    197,
    'Italia Independent',
    'Italia Independent',
    ''
  );
  INSERT INTO BORSA VALUES(
    198,
    'Italian Exhibition Group',
    'Italian Exhibition Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    199,
    'Italian Wine Brands',
    'Italian Wine Brands',
    ''
  );
  INSERT INTO BORSA VALUES(
    200,
    'Italmobiliare',
    'Italmobiliare',
    ''
  );
  INSERT INTO BORSA VALUES(
    201,
    'Iveco Group',
    'Iveco Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    202,
    'Alphabet Classe C',
    'Alphabet Classe C',
    'GOOGL.MI'
  );
  INSERT INTO BORSA VALUES(
    203,
    'Ivs Group',
    'Ivs Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    204,
    'Jonix',
    'Jonix',
    ''
  );
  INSERT INTO BORSA VALUES(
    205,
    'Juventus Football Club',
    'Juventus Football Club',
    ''
  );
  INSERT INTO BORSA VALUES(
    206,
    'K+S',
    'K+S',
    ''
  );
  INSERT INTO BORSA VALUES(
    207,
    'Kering',
    'Kering',
    ''
  );
  INSERT INTO BORSA VALUES(
    208,
    'Kme Group',
    'Kme Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    209,
    'Kme Group Rsp',
    'Kme Group Rsp',
    ''
  );
  INSERT INTO BORSA VALUES(
    210,
    'Kolinpharma',
    'Kolinpharma',
    ''
  );
  INSERT INTO BORSA VALUES(
    211,
    'Labomar',
    'Labomar',
    ''
  );
  INSERT INTO BORSA VALUES(
    212,
    'Laboratorio Farmaceutico Erfo',
    'Laboratorio Farmaceutico Erfo',
    ''
  );
  INSERT INTO BORSA VALUES(
    213,
    'Altea Green Power',
    'Altea Green Power',
    'AGP.MI'
  );
  INSERT INTO BORSA VALUES(
    214,
    'Landi Renzo',
    'Landi Renzo',
    ''
  );
  INSERT INTO BORSA VALUES(
    215,
    'Leonardo',
    'Leonardo',
    ''
  );
  INSERT INTO BORSA VALUES(
    216,
    'Leone Film Group',
    'Leone Film Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    217,
    'Lindbergh',
    'Lindbergh',
    ''
  );
  INSERT INTO BORSA VALUES(
    218,
    'Longino&Cardenal',
    'Longino&Cardenal',
    ''
  );
  INSERT INTO BORSA VALUES(
    219,
    'Lucisano Media Group',
    'Lucisano Media Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    220,
    'Luve',
    'Luve',
    ''
  );
  INSERT INTO BORSA VALUES(
    221,
    'Lventure Group',
    'Lventure Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    222,
    'Lvmh',
    'Lvmh',
    ''
  );
  INSERT INTO BORSA VALUES(
    223,
    'Lyft',
    'Lyft',
    ''
  );
  INSERT INTO BORSA VALUES(
    224,
    'Abitare In',
    'Abitare In',
    'ABT.MI'
  );
  INSERT INTO BORSA VALUES(
    225,
    'Amazon',
    'Amazon',
    'AMZN.MI'
  );
  INSERT INTO BORSA VALUES(
    226,
    'Magis',
    'Magis',
    ''
  );
  INSERT INTO BORSA VALUES(
    227,
    'Maire Tecnimont',
    'Maire Tecnimont',
    ''
  );
  INSERT INTO BORSA VALUES(
    228,
    'Maps',
    'Maps',
    ''
  );
  INSERT INTO BORSA VALUES(
    229,
    'Marr',
    'Marr',
    ''
  );
  INSERT INTO BORSA VALUES(
    230,
    'Marzocchi Pompe',
    'Marzocchi Pompe',
    ''
  );
  INSERT INTO BORSA VALUES(
    231,
    'Masi Agricola',
    'Masi Agricola',
    ''
  );
  INSERT INTO BORSA VALUES(
    232,
    'Matica Fintec',
    'Matica Fintec',
    ''
  );
  INSERT INTO BORSA VALUES(
    233,
    'Medica',
    'Medica',
    ''
  );
  INSERT INTO BORSA VALUES(
    234,
    'Mediobanca',
    'Mediobanca',
    ''
  );
  INSERT INTO BORSA VALUES(
    235,
    'Meglioquesto',
    'Meglioquesto',
    ''
  );
  INSERT INTO BORSA VALUES(
    236,
    'Ambromobiliare',
    'Ambromobiliare',
    'AMB.MI'
  );
  INSERT INTO BORSA VALUES(
    237,
    'Mercedes-Benz Group',
    'Mercedes-Benz Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    238,
    'Merck',
    'Merck',
    ''
  );
  INSERT INTO BORSA VALUES(
    239,
    'Met.Extra Group',
    'Met.Extra Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    240,
    'Meta Platforms',
    'Meta Platforms',
    ''
  );
  INSERT INTO BORSA VALUES(
    241,
    'Mfe A',
    'Mfe A',
    ''
  );
  INSERT INTO BORSA VALUES(
    242,
    'Mfe B',
    'Mfe B',
    ''
  );
  INSERT INTO BORSA VALUES(
    243,
    'Micron Technology',
    'Micron Technology',
    ''
  );
  INSERT INTO BORSA VALUES(
    244,
    'Microsoft Corp',
    'Microsoft Corp',
    ''
  );
  INSERT INTO BORSA VALUES(
    245,
    'Mit Sim',
    'Mit Sim',
    ''
  );
  INSERT INTO BORSA VALUES(
    246,
    'Mittel',
    'Mittel',
    ''
  );
  INSERT INTO BORSA VALUES(
    247,
    'Amgen',
    'Amgen',
    'AMGN'
  );
  INSERT INTO BORSA VALUES(
    248,
    'Moderna',
    'Moderna',
    ''
  );
  INSERT INTO BORSA VALUES(
    249,
    'Moncler',
    'Moncler',
    ''
  );
  INSERT INTO BORSA VALUES(
    250,
    'Mondadori Editore',
    'Mondadori Editore',
    ''
  );
  INSERT INTO BORSA VALUES(
    251,
    'Mondo Tv',
    'Mondo Tv',
    ''
  );
  INSERT INTO BORSA VALUES(
    252,
    'Mondo Tv France',
    'Mondo Tv France',
    ''
  );
  INSERT INTO BORSA VALUES(
    253,
    'Mondo Tv Suisse',
    'Mondo Tv Suisse',
    ''
  );
  INSERT INTO BORSA VALUES(
    254,
    'Monnalisa',
    'Monnalisa',
    ''
  );
  INSERT INTO BORSA VALUES(
    255,
    'Monrif',
    'Monrif',
    ''
  );
  INSERT INTO BORSA VALUES(
    256,
    'Munich Re',
    'Munich Re',
    ''
  );
  INSERT INTO BORSA VALUES(
    257,
    'Mutuionline',
    'Mutuionline',
    ''
  );
  INSERT INTO BORSA VALUES(
    258,
    'Amplifon',
    'Amplifon',
    'AMP.MI'
  );
  INSERT INTO BORSA VALUES(
    259,
    'Nb Aurora',
    'Nb Aurora',
    ''
  );
  INSERT INTO BORSA VALUES(
    260,
    'Neodecortech',
    'Neodecortech',
    ''
  );
  INSERT INTO BORSA VALUES(
    261,
    'Neosperience',
    'Neosperience',
    ''
  );
  INSERT INTO BORSA VALUES(
    262,
    'Net Insurance',
    'Net Insurance',
    ''
  );
  INSERT INTO BORSA VALUES(
    263,
    'Netflix',
    'Netflix',
    ''
  );
  INSERT INTO BORSA VALUES(
    264,
    'Netweek',
    'Netweek',
    ''
  );
  INSERT INTO BORSA VALUES(
    265,
    'Neurosoft',
    'Neurosoft',
    ''
  );
  INSERT INTO BORSA VALUES(
    266,
    'Newlat Food',
    'Newlat Food',
    ''
  );
  INSERT INTO BORSA VALUES(
    267,
    'Nexi',
    'Nexi',
    ''
  );
  INSERT INTO BORSA VALUES(
    268,
    'Next Re',
    'Next Re',
    ''
  );
  INSERT INTO BORSA VALUES(
    269,
    'Anheuser-Busch',
    'Anheuser-Busch',
    'ABI.MI'
  );
  INSERT INTO BORSA VALUES(
    270,
    'Nice Footwear',
    'Nice Footwear',
    ''
  );
  INSERT INTO BORSA VALUES(
    271,
    'Nokia Corporation',
    'Nokia Corporation',
    ''
  );
  INSERT INTO BORSA VALUES(
    272,
    'Notorious Pictures',
    'Notorious Pictures',
    ''
  );
  INSERT INTO BORSA VALUES(
    273,
    'Nusco',
    'Nusco',
    ''
  );
  INSERT INTO BORSA VALUES(
    274,
    'Nvidia Corp',
    'Nvidia Corp',
    ''
  );
  INSERT INTO BORSA VALUES(
    275,
    'Nvp',
    'Nvp',
    ''
  );
  INSERT INTO BORSA VALUES(
    276,
    'Officina Stellare',
    'Officina Stellare',
    ''
  );
  INSERT INTO BORSA VALUES(
    277,
    'Omer',
    'Omer',
    ''
  );
  INSERT INTO BORSA VALUES(
    278,
    'Openjobmetis',
    'Openjobmetis',
    ''
  );
  INSERT INTO BORSA VALUES(
    279,
    'Orange',
    'Orange',
    ''
  );
  INSERT INTO BORSA VALUES(
    280,
    'Anima Holding',
    'Anima Holding',
    'ANIM.MI'
  );
  INSERT INTO BORSA VALUES(
    281,
    'Orsero',
    'Orsero',
    ''
  );
  INSERT INTO BORSA VALUES(
    282,
    'Osai Automation System',
    'Osai Automation System',
    ''
  );
  INSERT INTO BORSA VALUES(
    283,
    'Ovs',
    'Ovs',
    ''
  );
  INSERT INTO BORSA VALUES(
    284,
    'Pattern',
    'Pattern',
    ''
  );
  INSERT INTO BORSA VALUES(
    285,
    'Pharmanutra',
    'Pharmanutra',
    ''
  );
  INSERT INTO BORSA VALUES(
    286,
    'Philips',
    'Philips',
    ''
  );
  INSERT INTO BORSA VALUES(
    287,
    'Philogen',
    'Philogen',
    ''
  );
  INSERT INTO BORSA VALUES(
    288,
    'Piaggio & C',
    'Piaggio & C',
    ''
  );
  INSERT INTO BORSA VALUES(
    289,
    'Pierrel',
    'Pierrel',
    ''
  );
  INSERT INTO BORSA VALUES(
    290,
    'Pininfarina',
    'Pininfarina',
    ''
  );
  INSERT INTO BORSA VALUES(
    291,
    'Antares Vision',
    'Antares Vision',
    'AV.MI'
  );
  INSERT INTO BORSA VALUES(
    292,
    'Piovan',
    'Piovan',
    ''
  );
  INSERT INTO BORSA VALUES(
    293,
    'Piquadro',
    'Piquadro',
    ''
  );
  INSERT INTO BORSA VALUES(
    294,
    'Pirelli & C',
    'Pirelli & C',
    ''
  );
  INSERT INTO BORSA VALUES(
    295,
    'Planetel',
    'Planetel',
    ''
  );
  INSERT INTO BORSA VALUES(
    296,
    'Plc',
    'Plc',
    ''
  );
  INSERT INTO BORSA VALUES(
    297,
    'Poligrafici Printing',
    'Poligrafici Printing',
    ''
  );
  INSERT INTO BORSA VALUES(
    298,
    'Portale Sardegna',
    'Portale Sardegna',
    ''
  );
  INSERT INTO BORSA VALUES(
    299,
    'Portobello',
    'Portobello',
    ''
  );
  INSERT INTO BORSA VALUES(
    300,
    'Poste Italiane',
    'Poste Italiane',
    ''
  );
  INSERT INTO BORSA VALUES(
    301,
    'Powersoft',
    'Powersoft',
    ''
  );
  INSERT INTO BORSA VALUES(
    302,
    'Apple',
    'Apple',
    'AAPL.MI'
  );
  INSERT INTO BORSA VALUES(
    303,
    'Pozzi Milano',
    'Pozzi Milano',
    ''
  );
  INSERT INTO BORSA VALUES(
    304,
    'Prima Industrie',
    'Prima Industrie',
    ''
  );
  INSERT INTO BORSA VALUES(
    305,
    'Prismi',
    'Prismi',
    'PRM.MI'
  );
  INSERT INTO BORSA VALUES(
    306,
    'Promotica',
    'Promotica',
    ''
  );
  INSERT INTO BORSA VALUES(
    307,
    'Prosiebensat1 Media',
    'Prosiebensat1 Media',
    ''
  );
  INSERT INTO BORSA VALUES(
    308,
    'Prysmian',
    'Prysmian',
    ''
  );
  INSERT INTO BORSA VALUES(
    309,
    'Puma',
    'Puma',
    ''
  );
  INSERT INTO BORSA VALUES(
    310,
    'Racing Force',
    'Racing Force',
    ''
  );
  INSERT INTO BORSA VALUES(
    311,
    'Radici',
    'Radici',
    ''
  );
  INSERT INTO BORSA VALUES(
    312,
    'Rai Way',
    'Rai Way',
    ''
  );
  INSERT INTO BORSA VALUES(
    313,
    'Aquafil',
    'Aquafil',
    'ECNL.MI'
  );
  INSERT INTO BORSA VALUES(
    314,
    'Ratti',
    'Ratti',
    ''
  );
  INSERT INTO BORSA VALUES(
    315,
    'Rcs Mediagroup',
    'Rcs Mediagroup',
    ''
  );
  INSERT INTO BORSA VALUES(
    316,
    'Recordati Ord',
    'Recordati Ord',
    ''
  );
  INSERT INTO BORSA VALUES(
    317,
    'Redelfi',
    'Redelfi',
    ''
  );
  INSERT INTO BORSA VALUES(
    318,
    'Reevo',
    'Reevo',
    ''
  );
  INSERT INTO BORSA VALUES(
    319,
    'Relatech',
    'Relatech',
    ''
  );
  INSERT INTO BORSA VALUES(
    320,
    'Renault',
    'Renault',
    ''
  );
  INSERT INTO BORSA VALUES(
    321,
    'Renergetica',
    'Renergetica',
    ''
  );
  INSERT INTO BORSA VALUES(
    322,
    'Reply',
    'Reply',
    ''
  );
  INSERT INTO BORSA VALUES(
    323,
    'Repsol',
    'Repsol',
    ''
  );
  INSERT INTO BORSA VALUES(
    324,
    'Ariston Holding',
    'Ariston Holding',
    'ARIS.MI'
  );
  INSERT INTO BORSA VALUES(
    325,
    'Restart',
    'Restart',
    ''
  );
  INSERT INTO BORSA VALUES(
    326,
    'Reti',
    'Reti',
    ''
  );
  INSERT INTO BORSA VALUES(
    327,
    'Revo Insurance',
    'Revo Insurance',
    ''
  );
  INSERT INTO BORSA VALUES(
    328,
    'Risanamento',
    'Risanamento',
    ''
  );
  INSERT INTO BORSA VALUES(
    329,
    'Rocket Sharing Company',
    'Rocket Sharing Company',
    ''
  );
  INSERT INTO BORSA VALUES(
    330,
    'Rosetti Marino',
    'Rosetti Marino',
    ''
  );
  INSERT INTO BORSA VALUES(
    331,
    'Rwe',
    'Rwe',
    ''
  );
  INSERT INTO BORSA VALUES(
    332,
    'S.I.F. Italia',
    'S.I.F. Italia',
    ''
  );
  INSERT INTO BORSA VALUES(
    333,
    'S.S. Lazio',
    'S.S. Lazio',
    ''
  );
  INSERT INTO BORSA VALUES(
    334,
    'Sababa Security',
    'Sababa Security',
    ''
  );
  INSERT INTO BORSA VALUES(
    335,
    'Acea',
    'Acea',
    'ACE.MI'
  );
  INSERT INTO BORSA VALUES(
    336,
    'Arterra Bioscience',
    'Arterra Bioscience',
    'ABS.MI'
  );
  INSERT INTO BORSA VALUES(
    337,
    'Sabaf',
    'Sabaf',
    ''
  );
  INSERT INTO BORSA VALUES(
    338,
    'Saccheria F.Lli Franceschetti',
    'Saccheria F.Lli Franceschetti',
    ''
  );
  INSERT INTO BORSA VALUES(
    339,
    'Saes Getters',
    'Saes Getters',
    ''
  );
  INSERT INTO BORSA VALUES(
    340,
    'Saes Getters Rsp',
    'Saes Getters Rsp',
    ''
  );
  INSERT INTO BORSA VALUES(
    341,
    'Safilo Group',
    'Safilo Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    342,
    'Saipem',
    'Saipem',
    ''
  );
  INSERT INTO BORSA VALUES(
    343,
    'Salcef Group',
    'Salcef Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    344,
    'Salvatore Ferragamo',
    'Salvatore Ferragamo',
    ''
  );
  INSERT INTO BORSA VALUES(
    345,
    'Sanlorenzo',
    'Sanlorenzo',
    ''
  );
  INSERT INTO BORSA VALUES(
    346,
    'Sanofi',
    'Sanofi',
    ''
  );
  INSERT INTO BORSA VALUES(
    347,
    'Ascopiave',
    'Ascopiave',
    'ASC.MI'
  );
  INSERT INTO BORSA VALUES(
    348,
    'Sap',
    'Sap',
    ''
  );
  INSERT INTO BORSA VALUES(
    349,
    'Saras',
    'Saras',
    ''
  );
  INSERT INTO BORSA VALUES(
    350,
    'Sciuker Frames',
    'Sciuker Frames',
    ''
  );
  INSERT INTO BORSA VALUES(
    351,
    'Sebino',
    'Sebino',
    ''
  );
  INSERT INTO BORSA VALUES(
    352,
    'Seco',
    'Seco',
    ''
  );
  INSERT INTO BORSA VALUES(
    353,
    'Seri Industrial',
    'Seri Industrial',
    ''
  );
  INSERT INTO BORSA VALUES(
    354,
    'Servizi Italia',
    'Servizi Italia',
    ''
  );
  INSERT INTO BORSA VALUES(
    355,
    'Sesa',
    'Sesa',
    ''
  );
  INSERT INTO BORSA VALUES(
    356,
    'Sg Company',
    'Sg Company',
    ''
  );
  INSERT INTO BORSA VALUES(
    357,
    'Shedir Pharma Group',
    'Shedir Pharma Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    358,
    'Askoll Eva',
    'Askoll Eva',
    'EVA.MI'
  );
  INSERT INTO BORSA VALUES(
    359,
    'Siav',
    'Siav',
    ''
  );
  INSERT INTO BORSA VALUES(
    360,
    'Siemens',
    'Siemens',
    ''
  );
  INSERT INTO BORSA VALUES(
    361,
    'Siemens Energy',
    'Siemens Energy',
    ''
  );
  INSERT INTO BORSA VALUES(
    362,
    'Sit',
    'Sit',
    ''
  );
  INSERT INTO BORSA VALUES(
    363,
    'Snam',
    'Snam',
    ''
  );
  INSERT INTO BORSA VALUES(
    364,
    'Snowflake',
    'Snowflake',
    ''
  );
  INSERT INTO BORSA VALUES(
    365,
    'Societa'' Editoriale Il Fatto',
    'Societa'' Editoriale Il Fatto',
    ''
  );
  INSERT INTO BORSA VALUES(
    366,
    'Societe Generale',
    'Societe Generale',
    ''
  );
  INSERT INTO BORSA VALUES(
    367,
    'Softec',
    'Softec',
    ''
  );
  INSERT INTO BORSA VALUES(
    368,
    'Softlab',
    'Softlab',
    ''
  );
  INSERT INTO BORSA VALUES(
    369,
    'Asml',
    'Asml',
    'ASML.MI'
  );
  INSERT INTO BORSA VALUES(
    370,
    'Sogefi',
    'Sogefi',
    ''
  );
  INSERT INTO BORSA VALUES(
    371,
    'Sol',
    'Sol',
    ''
  );
  INSERT INTO BORSA VALUES(
    372,
    'Solid World Group',
    'Solid World Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    373,
    'Solutions Capital Management Sim',
    'Solutions Capital Management Sim',
    ''
  );
  INSERT INTO BORSA VALUES(
    374,
    'Somec',
    'Somec',
    ''
  );
  INSERT INTO BORSA VALUES(
    375,
    'Sostravel.Com',
    'Sostravel.Com',
    ''
  );
  INSERT INTO BORSA VALUES(
    376,
    'Spindox',
    'Spindox',
    ''
  );
  INSERT INTO BORSA VALUES(
    377,
    'Star7',
    'Star7',
    ''
  );
  INSERT INTO BORSA VALUES(
    378,
    'Starbucks Corp',
    'Starbucks Corp',
    ''
  );
  INSERT INTO BORSA VALUES(
    379,
    'Stellantis',
    'Stellantis',
    ''
  );
  INSERT INTO BORSA VALUES(
    380,
    'Aton Green Storage',
    'Aton Green Storage',
    'ATON.MI'
  );
  INSERT INTO BORSA VALUES(
    381,
    'Stmicroelectronics',
    'Stmicroelectronics',
    ''
  );
  INSERT INTO BORSA VALUES(
    382,
    'Svas Biosana',
    'Svas Biosana',
    ''
  );
  INSERT INTO BORSA VALUES(
    383,
    'Take Off',
    'Take Off',
    ''
  );
  INSERT INTO BORSA VALUES(
    384,
    'Tamburi Investment Partners',
    'Tamburi Investment Partners',
    ''
  );
  INSERT INTO BORSA VALUES(
    385,
    'Technogym',
    'Technogym',
    ''
  );
  INSERT INTO BORSA VALUES(
    386,
    'Technoprobe',
    'Technoprobe',
    ''
  );
  INSERT INTO BORSA VALUES(
    387,
    'Tecma Solutions',
    'Tecma Solutions',
    ''
  );
  INSERT INTO BORSA VALUES(
    388,
    'Telecom Italia',
    'Telecom Italia',
    'TIT.MI'
  );
  INSERT INTO BORSA VALUES(
    389,
    'Telecom Italia Rsp',
    'Telecom Italia Rsp',
    ''
  );
  INSERT INTO BORSA VALUES(
    390,
    'Telefonica',
    'Telefonica',
    ''
  );
  INSERT INTO BORSA VALUES(
    391,
    'Autogrill',
    'Autogrill',
    'AGL.MI'
  );
  INSERT INTO BORSA VALUES(
    392,
    'Telesia',
    'Telesia',
    ''
  );
  INSERT INTO BORSA VALUES(
    393,
    'Tenaris',
    'Tenaris',
    ''
  );
  INSERT INTO BORSA VALUES(
    394,
    'Tenax International',
    'Tenax International',
    ''
  );
  INSERT INTO BORSA VALUES(
    395,
    'Terna',
    'Terna',
    ''
  );
  INSERT INTO BORSA VALUES(
    396,
    'Tesla',
    'Tesla',
    ''
  );
  INSERT INTO BORSA VALUES(
    397,
    'Tesmec',
    'Tesmec',
    ''
  );
  INSERT INTO BORSA VALUES(
    398,
    'Tessellis',
    'Tessellis',
    ''
  );
  INSERT INTO BORSA VALUES(
    399,
    'The Italian Sea Group',
    'The Italian Sea Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    400,
    'The Lifestyle Group',
    'The Lifestyle Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    401,
    'Thyssenkrupp',
    'Thyssenkrupp',
    ''
  );
  INSERT INTO BORSA VALUES(
    402,
    'Autostrade Merid',
    'Autostrade Merid',
    'AUTME.MI'
  );
  INSERT INTO BORSA VALUES(
    403,
    'Tinexta',
    'Tinexta',
    ''
  );
  INSERT INTO BORSA VALUES(
    404,
    'Tmp Group',
    'Tmp Group',
    ''
  );
  INSERT INTO BORSA VALUES(
    405,
    'Tod''S',
    'Tod''S',
    ''
  );
  INSERT INTO BORSA VALUES(
    406,
    'Toscana Aeroporti',
    'Toscana Aeroporti',
    ''
  );
  INSERT INTO BORSA VALUES(
    407,
    'Tps',
    'Tps',
    ''
  );
  INSERT INTO BORSA VALUES(
    408,
    'Trawell Co',
    'Trawell Co',
    ''
  );
  INSERT INTO BORSA VALUES(
    409,
    'Trendevice',
    'Trendevice',
    ''
  );
  INSERT INTO BORSA VALUES(
    410,
    'Trevi Fin Industriale',
    'Trevi Fin Industriale',
    ''
  );
  INSERT INTO BORSA VALUES(
    411,
    'Triboo',
    'Triboo',
    ''
  );
  INSERT INTO BORSA VALUES(
    412,
    'Tripadvisor',
    'Tripadvisor',
    ''
  );
  INSERT INTO BORSA VALUES(
    413,
    'Avio',
    'Avio',
    'AVIO.MI'
  );
  INSERT INTO BORSA VALUES(
    414,
    'Txt',
    'Txt',
    ''
  );
  INSERT INTO BORSA VALUES(
    415,
    'Ucapital24',
    'Ucapital24',
    ''
  );
  INSERT INTO BORSA VALUES(
    416,
    'Ulisse Biomed',
    'Ulisse Biomed',
    ''
  );
  INSERT INTO BORSA VALUES(
    417,
    'Unicredit',
    'Unicredit',
    'UCG.MI'
  );
  INSERT INTO BORSA VALUES(
    418,
    'Unidata',
    'Unidata',
    ''
  );
  INSERT INTO BORSA VALUES(
    419,
    'Unieuro',
    'Unieuro',
    ''
  );
  INSERT INTO BORSA VALUES(
    420,
    'Unipol',
    'Unipol',
    ''
  );
  INSERT INTO BORSA VALUES(
    421,
    'Unipolsai',
    'Unipolsai',
    ''
  );
  INSERT INTO BORSA VALUES(
    422,
    'Valsoia',
    'Valsoia',
    ''
  );
  INSERT INTO BORSA VALUES(
    423,
    'Vantea Smart',
    'Vantea Smart',
    ''
  );
  INSERT INTO BORSA VALUES(
    424,
    'Axa',
    'Axa',
    'AXA.MI'
  );
  INSERT INTO BORSA VALUES(
    425,
    'Vianini',
    'Vianini',
    ''
  );
  INSERT INTO BORSA VALUES(
    426,
    'Vimi Fasteners',
    'Vimi Fasteners',
    ''
  );
  INSERT INTO BORSA VALUES(
    427,
    'Virgin Galactic Holdings',
    'Virgin Galactic Holdings',
    ''
  );
  INSERT INTO BORSA VALUES(
    428,
    'Visibilia Editore',
    'Visibilia Editore',
    ''
  );
  INSERT INTO BORSA VALUES(
    429,
    'Vivendi',
    'Vivendi',
    ''
  );
  INSERT INTO BORSA VALUES(
    430,
    'Volkswagen',
    'Volkswagen',
    ''
  );
  INSERT INTO BORSA VALUES(
    431,
    'Vonovia',
    'Vonovia',
    ''
  );
  INSERT INTO BORSA VALUES(
    432,
    'Warr Agatos 2018-2025',
    'Warr Agatos 2018-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    433,
    'Warr Alfio Bardolla 2017-2027',
    'Warr Alfio Bardolla 2017-2027',
    ''
  );
  INSERT INTO BORSA VALUES(
    434,
    'Warr Alfonsino 2021-2024',
    'Warr Alfonsino 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    435,
    'Azimut Holding',
    'Azimut Holding',
    ''
  );
  INSERT INTO BORSA VALUES(
    436,
    'Warr Altea Green Power 2022-2024',
    'Warr Altea Green Power 2022-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    437,
    'Warr Cellularline',
    'Warr Cellularline',
    ''
  );
  INSERT INTO BORSA VALUES(
    438,
    'Warr Cofle 2021-2023',
    'Warr Cofle 2021-2023',
    ''
  );
  INSERT INTO BORSA VALUES(
    439,
    'Warr Cyberoo 2019-2023',
    'Warr Cyberoo 2019-2023',
    ''
  );
  INSERT INTO BORSA VALUES(
    440,
    'Warr Deodato.Gallery 2023-2028',
    'Warr Deodato.Gallery 2023-2028',
    ''
  );
  INSERT INTO BORSA VALUES(
    441,
    'Warr Eles 2019-2024',
    'Warr Eles 2019-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    442,
    'Warr Erfo 2022-2025',
    'Warr Erfo 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    443,
    'Warr Fae Technology 2022-2025',
    'Warr Fae Technology 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    444,
    'Warr Finanza.Tech 2021-2024',
    'Warr Finanza.Tech 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    445,
    'Warr Franchetti 2022-2025',
    'Warr Franchetti 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    446,
    'Acinque',
    'Acinque',
    'AC5.MI'
  );
  INSERT INTO BORSA VALUES(
    447,
    'B&C Speakers',
    'B&C Speakers',
    'BEC.MI'
  );
  INSERT INTO BORSA VALUES(
    448,
    'Warr Franchi Umberto Marmi',
    'Warr Franchi Umberto Marmi',
    ''
  );
  INSERT INTO BORSA VALUES(
    449,
    'Warr G Rent 2021-2024',
    'Warr G Rent 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    450,
    'Warr Gismondi 1754 2019-2024',
    'Warr Gismondi 1754 2019-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    451,
    'Warr Idntt 2021-2024',
    'Warr Idntt 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    452,
    'Warr Impianti 2022-2025',
    'Warr Impianti 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    453,
    'Warr Iscc Fintech 2021-2024',
    'Warr Iscc Fintech 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    454,
    'Warr Kme Group 2021-2024',
    'Warr Kme Group 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    455,
    'Warr Lindbergh 2021-2024',
    'Warr Lindbergh 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    456,
    'Warr Magis',
    'Warr Magis',
    ''
  );
  INSERT INTO BORSA VALUES(
    457,
    'Warr Maps 2019-2024',
    'Warr Maps 2019-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    458,
    'B.F.',
    'B.F.',
    'BFG.MI'
  );
  INSERT INTO BORSA VALUES(
    459,
    'Warr Meglioquesto 2021-2025',
    'Warr Meglioquesto 2021-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    460,
    'Warr Net Insurance 2019-2023',
    'Warr Net Insurance 2019-2023',
    ''
  );
  INSERT INTO BORSA VALUES(
    461,
    'Warr Nice Footwear 2021-2026',
    'Warr Nice Footwear 2021-2026',
    ''
  );
  INSERT INTO BORSA VALUES(
    462,
    'Warr Nusco 2021-2024',
    'Warr Nusco 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    463,
    'Warr Osai 2020-2025',
    'Warr Osai 2020-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    464,
    'Warr Redelfi 2022-2025',
    'Warr Redelfi 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    465,
    'Warr Restart 2015-2024',
    'Warr Restart 2015-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    466,
    'Warr Rocket Sharing Company 2022-2025',
    'Warr Rocket Sharing Company 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    467,
    'Warr S.I.F. Italia 2021-2024',
    'Warr S.I.F. Italia 2021-2024',
    ''
  );
  INSERT INTO BORSA VALUES(
    468,
    'Warr Saccheria F.Lli Franceschetti 22-25',
    'Warr Saccheria F.Lli Franceschetti 22-25',
    ''
  );
  INSERT INTO BORSA VALUES(
    469,
    'Banca Generali',
    'Banca Generali',
    'BGN.MI'
  );
  INSERT INTO BORSA VALUES(
    470,
    'Warr Solid World Group 2022-2025',
    'Warr Solid World Group 2022-2025',
    ''
  );
  INSERT INTO BORSA VALUES(
    471,
    'Zignago Vetro',
    'Zignago Vetro',
    'ZV.MI'
  );
  INSERT INTO BORSA VALUES(
    472,
    'Zucchi',
    'Zucchi',
    'ZUC.MI'
  );
  INSERT INTO BORSA VALUES(
    473,
    'L&G Artificial Intelligence UCITS ETF',
    'L&G Artificial Intelligence UCITS ETF',
    'AIAI.MI'
  );
  INSERT INTO BORSA VALUES(
    474,
    'Banca Ifis',
    'Banca Ifis',
    'IF.MI'
  );
  INSERT INTO BORSA VALUES(
    475,
    'Banca Mediolanum',
    'Banca Mediolanum',
    'BMED.MI'
  );
  INSERT INTO BORSA VALUES(
    476,
    'Banca Monte Paschi Siena',
    'Banca Monte Paschi Siena',
    'BMPS.MI'
  );
  INSERT INTO BORSA VALUES(
    477,
    'Banca Sistema',
    'Banca Sistema',
    'BST.MI'
  );
  INSERT INTO BORSA VALUES(
    478,
    'Banco Bpm',
    'Banco Bpm',
    'BAMI.MI'
  );
  INSERT INTO BORSA VALUES(
    480,
    'Basf',
    'Basf',
    'BASF.MI'
  );
  INSERT INTO BORSA VALUES(
    481,
    'Adidas',
    'Adidas',
    'ADS.MI'
  );
  INSERT INTO BORSA VALUES(
    482,
    'Basicnet',
    'Basicnet',
    'BAN.MI'
  );
  INSERT INTO BORSA VALUES(
    483,
    'Bastogi',
    'Bastogi',
    'B.MI'
  );
  INSERT INTO BORSA VALUES(
    484,
    'Bayer',
    'Bayer',
    'BAY.MI'
  );
  INSERT INTO BORSA VALUES(
    485,
    'Bb Biotech',
    'Bb Biotech',
    'BB.MI'
  );
  INSERT INTO BORSA VALUES(
    486,
    'Bbva',
    'Bbva',
    ''
  );
  INSERT INTO BORSA VALUES(
    487,
    'Bca Pop Sondrio',
    'Bca Pop Sondrio',
    'BPSO.MI'
  );
  INSERT INTO BORSA VALUES(
    488,
    'Bca Profilo',
    'Bca Profilo',
    'PRO.MI'
  );
  INSERT INTO BORSA VALUES(
    489,
    'Bco Desio Brianza',
    'Bco Desio Brianza',
    'BDB.MI'
  );
  INSERT INTO BORSA VALUES(
    490,
    'Beewize',
    'Beewize',
    'BWZ.MI'
  );
  INSERT INTO BORSA VALUES(
    491,
    'Beghelli',
    'Beghelli',
    'BE.MI'
  );
  INSERT INTO BORSA VALUES(
    492,
    'Advanced Micro Devices',
    'Advanced Micro Devices',
    'AMD'
  );
  INSERT INTO BORSA VALUES(
    493,
    'Beiersdorf',
    'Beiersdorf',
    ''
  );
  INSERT INTO BORSA VALUES(
    494,
    'Bellini Nautica',
    'Bellini Nautica',
    'BELL.MI'
  );
  INSERT INTO BORSA VALUES(
    495,
    'Bfc Media',
    'Bfc Media',
    'BFC.MI'
  );
  INSERT INTO BORSA VALUES(
    496,
    'Bff Bank',
    'Bff Bank',
    'BFF.MI'
  );
  INSERT INTO BORSA VALUES(
    497,
    'Bialetti Industrie',
    'Bialetti Industrie',
    'BIA.MI'
  );
  INSERT INTO BORSA VALUES(
    498,
    'Biesse',
    'Biesse',
    'BSS.MI'
  );
  INSERT INTO BORSA VALUES(
    499,
    'Bifire',
    'Bifire',
    'FIRE.MI'
  );
  INSERT INTO BORSA VALUES(
    500,
    'Bioera',
    'Bioera',
    'BIE.MI'
  );
  INSERT INTO BORSA VALUES(
    501,
    'Bioera Axa',
    'Bioera Axa',
    ''
  );
  INSERT INTO BORSA VALUES(
    502,
    'Bmw',
    'Bmw',
    'BMW.MI'
  );
  INSERT INTO BORSA VALUES(
    503,
    'Aedes',
    'Aedes',
    'AED.MI'
  );
  INSERT INTO BORSA VALUES(
    504,
    'Bnp Paribas',
    'Bnp Paribas',
    ''
  );
  INSERT INTO BORSA VALUES(
    505,
    'Borgosesia',
    'Borgosesia',
    'BO.MI'
  );
  INSERT INTO BORSA VALUES(
    506,
    'Bper Banca',
    'Bper Banca',
    'BPE.MI'
  );
  INSERT INTO BORSA VALUES(
    507,
    'Brembo',
    'Brembo',
    'BRE.MI'
  );
  INSERT INTO BORSA VALUES(
    508,
    'Brioschi',
    'Brioschi',
    'BRI.MI'
  );
  INSERT INTO BORSA VALUES(
    509,
    'Brunello Cucinelli',
    'Brunello Cucinelli',
    'BC.MI'
  );
  INSERT INTO BORSA VALUES(
    510,
    'Buzzi Unicem',
    'Buzzi Unicem',
    'BZU.MI'
  );
  INSERT INTO BORSA VALUES(
    511,
    'Cairo Communication',
    'Cairo Communication',
    'CAI.MI'
  );
  INSERT INTO BORSA VALUES(
    512,
    'Caleffi',
    'Caleffi',
    'CLF.MI'
  );
  INSERT INTO BORSA VALUES(
    513,
    'Caltagirone',
    'Caltagirone',
    'CALT.MI'
  );
  INSERT INTO BORSA VALUES(
    514,
    'Aeffe',
    'Aeffe',
    'AEF.MI'
  );
  INSERT INTO BORSA VALUES(
    515,
    'Caltagirone Edit',
    'Caltagirone Edit',
    'CED.MI'
  );
  INSERT INTO BORSA VALUES(
    516,
    'Campari',
    'Campari',
    'CPR.MI'
  );
  INSERT INTO BORSA VALUES(
    517,
    'Carel Industries',
    'Carel Industries',
    'CRL.MI'
  );
  INSERT INTO BORSA VALUES(
    518,
    'Casasold',
    'Casasold',
    'CASA.MI'
  );
  INSERT INTO BORSA VALUES(
    519,
    'Casta Diva Group',
    'Casta Diva Group',
    'CDG.MI'
  );
  INSERT INTO BORSA VALUES(
    520,
    'Cellularline',
    'Cellularline',
    'CELL.MI'
  );
  INSERT INTO BORSA VALUES(
    521,
    'Cembre',
    'Cembre',
    'CMB.MI'
  );
  INSERT INTO BORSA VALUES(
    522,
    'Cementir Holding',
    'Cementir Holding',
    'CEM.MI'
  );
  INSERT INTO STATO
    SELECT
      ID_AZIENDA,
      '',
      FALSE
    FROM
      BORSA;
  COMMIT;
  CREATE VIEW TREND AS
  SELECT
    ID_AZIENDA,
    DATA,
    APERTURA,
    MASSIMO,
    MINIMO,
    ULTIMOVALORE,
    ADJ,
    VOLUME,
    (ULTIMOVALORE-APERTURA)/ULTIMOVALORE VARIAZIONEPERCENTUALE
  FROM
    DATI;

CREATE TRIGGER TRG_AGGIORNAMENTO INSTEAD OF
  UPDATE OF ULTIMOAGGIORNAMENTO,
  ABILITATA ON STATOAZIONI BEGIN
  UPDATE STATO
  SET
    ULTIMOAGGIORNAMENTO=NEW.ULTIMOAGGIORNAMENTO,
    ABILITATA=NEW.ABILITATA
  WHERE
    ID_AZIENDA IN (
      SELECT ID_AZIENDA FROM BORSA WHERE SIGLA=OLD.SIGLA
    );
END;
