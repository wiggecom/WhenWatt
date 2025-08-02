const currencies = [
"CHF",
"DKK",
"EUR",
"HUF",
"NOK",
"PLN",
"SEK"
];

const countries = [
    {
        name: "Austria",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "AT" }]
    },
    {
        name: "Belgium",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "BE" }]
    },
    {
        name: "Bulgaria",
        defaultCurrency: "BGN",
        utcOffset: 3,
        regions: [{ code: "BG" }]
    },
    {
        name: "Croatia",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "HR" }]
    },
    {
        name: "Czech Republic",
        defaultCurrency: "CZK",
        utcOffset: 2,
        regions: [{ code: "CZ" }]
    },
    {
        name: "Denmark",
        defaultCurrency: "DKK",
        utcOffset: 2,
        regions: [{ code: "DK1" }, { code: "DK2" }]
    },
    {
        name: "Estonia",
        defaultCurrency: "EUR",
        utcOffset: 3,
        regions: [{ code: "EE" }]
    },
    {
        name: "Finland",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "FI" }]
    },
    {
        name: "France",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "FR" }]
    },
    {
        name: "Germany_Luxemburg",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "DE_LU" }]
    },
    {
        name: "Greece",
        defaultCurrency: "EUR",
        utcOffset: 3,
        regions: [{ code: "GR" }]
    },
    {
        name: "Hungary",
        defaultCurrency: "HUF",
        utcOffset: 2,
        regions: [{ code: "HU" }]
    },
    {
        name: "Ireland",
        defaultCurrency: "EUR",
        utcOffset: 1,
        regions: [{ code: "IE" }]
    },
    {
        name: "Italy",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [
            { code: "IT_Calabria" },
            { code: "IT_Centre_North" },
            { code: "IT_Centre_South" },
            { code: "IT_North" },
            { code: "IT_SACOAC" },
            { code: "IT_SACODC" },
            { code: "IT_Sardinia" },
            { code: "IT_Sicily" },
            { code: "IT_South" }
        ]
    },
    {
        name: "Latvia",
        defaultCurrency: "EUR",
        utcOffset: 3,
        regions: [{ code: "LV" }]
    },
    {
        name: "Lithuania",
        defaultCurrency: "EUR",
        utcOffset: 3,
        regions: [{ code: "LT" }]
    },
    {
        name: "Montenegro",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "ME" }]
    },
    {
        name: "Netherlands",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "NL" }]
    },
    {
        name: "Norway",
        defaultCurrency: "NOK",
        utcOffset: 2,
        regions: [
            { code: "NO1" },
            { code: "NO2" },
            { code: "NO3" },
            { code: "NO4" },
            { code: "NO5" }
        ]
    },
    {
        name: "Poland",
        defaultCurrency: "PLN",
        utcOffset: 2,
        regions: [{ code: "PL" }]
    },
    {
        name: "Portugal",
        defaultCurrency: "EUR",
        utcOffset: 1,
        regions: [{ code: "PT" }]
    },
    {
        name: "Romania",
        defaultCurrency: "RON",
        utcOffset: 3,
        regions: [{ code: "RO" }]
    },
    {
        name: "Serbia",
        defaultCurrency: "RSD",
        utcOffset: 2,
        regions: [{ code: "RS" }]
    },
    {
        name: "Slovakia",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "SK" }]
    },
    {
        name: "Slovenia",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "SI" }]
    },
    {
        name: "Spain",
        defaultCurrency: "EUR",
        utcOffset: 2,
        regions: [{ code: "ES" }]
    },
    {
        name: "Sweden",
        defaultCurrency: "SEK",
        utcOffset: 2,
        regions: [
            { code: "SE1" },
            { code: "SE2" },
            { code: "SE3" },
            { code: "SE4" }
        ]
    },
    {
        name: "Switzerland",
        defaultCurrency: "CHF",
        utcOffset: 2,
        regions: [{ code: "CH" }]
    }
];



/*
Austria 	     
Belgium 	     
Bulgaria 	     
Croatia 	     
Czech Republic 	 
Denmark          
Estonia 	     
Finland          
France 	         
Germany_Luxemburg
Greece 	         
Hungary 	     
Ireland 	     
Italy 	         
Latvia  	     
Lithuania 	     
Montenegro 	     
Netherlands      
Norway 	         
Poland 	         
Portugal 	     
Romania 	     
Serbia 	         
Slovakia 	     
Slovenia 	     
Spain 	         
Sweden 	         
Switzerland      


Sweden 	            SE1 	        10Y1001A1001A44P 	2
Sweden 	            SE2 	        10Y1001A1001A45N 	2
Sweden 	            SE3 	        10Y1001A1001A46L 	2
Sweden 	            SE4 	        10Y1001A1001A47J 	2
Denmark             DK1 	        10YDK-1--------W 	2
Denmark             DK2 	        10YDK-2--------M 	2
Finland             FI 	            10YFI-1--------U 	2
Norway 	            NO1 	        10YNO-1--------2 	2
Norway 	            NO2 	        10YNO-2--------T 	2
Norway 	            NO3 	        10YNO-3--------J 	2
Norway 	            NO4 	        10YNO-4--------9 	2
Norway 	            NO5 	        10Y1001A1001A48H 	2
Austria 	        AT 	            10YAT-APG------L 	2
Belgium 	        BE 	            10YBE----------2 	2
Croatia 	        HR 	            10YHR-HEP------M 	2
Czech Republic 	    CZ 	            10YCZ-CEPS-----N 	2
France 	            FR 	            10YFR-RTE------C 	2
Germany_Luxemburg 	DE_LU 	        10Y1001A1001A82H 	2
Greece 	            GR 	            10YGR-HTSO-----Y 	3
Hungary 	        HU 	            10YHU-MAVIR----U 	2
Ireland 	        IE 	            10Y1001A1001A59C 	1
Italy 	            IT_Calabria 	10Y1001C--00096J 	2
Italy 	            IT_Centre_North 10Y1001A1001A70O 	2
Italy 	            IT_Centre_South 10Y1001A1001A71M 	2
Italy 	            IT_North 	    10Y1001A1001A73I 	2
Italy 	            IT_SACOAC 	    10Y1001A1001A885 	2
Italy 	            IT_SACODC 	    10Y1001A1001A893 	2
Italy 	            IT_Sardinia     10Y1001A1001A74G 	2
Italy 	            IT_Sicily 	    10Y1001A1001A75E 	2
Italy 	            IT_South 	    10Y1001A1001A788 	2
Montenegro 	        ME 	            10YCS-CG-TSO---S 	2
Netherlands         NL 	            10YNL----------L 	2
Poland 	            PL 	            10YPL-AREA-----S 	2
Portugal 	        PT 	            10YPT-REN------W 	1
Spain 	            ES 	            10YES-REE------0 	2
Switzerland         CH 	            10YCH-SWISSGRIDZ 	2
Bulgaria 	        BG 	            10YCA-BULGARIA-R 	3
Estonia 	        EE 	            10Y1001A1001A39I 	3
Latvia  	        LV 	            10YLV-1001A00074 	3
Lithuania 	        LT 	            10YLT-1001A0008Q 	3
Romania 	        RO 	            10YRO-TEL------P 	3
Serbia 	            RS 	            10YCS-SERBIATSOV 	2
Slovakia 	        SK 	            10YSK-SEPS-----K 	2
Slovenia 	        SI 	            10YSI-ELES-----O 	2
 */

