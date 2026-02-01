    async function jsonSelector(){
        writeDateHeadlines();
        // writeMenu();
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        let cookieDate;
        let thisHour = today.getHours();

        const thisDayData = getCookieByName('thisDayCookie');
        let thisDayArray;

        if (thisDayData != null){
            // if cookie thisDayCookie exists, put data in an array and set variable cookieDate to date from data
            thisDayArray = JSON.parse(thisDayData);
            cookieDate = new Date(thisDayArray[0].time_start);
        }
        else{
            // if the cookie is null (doesn't exist), fetch data from api directly
            fetchData(true);
            if(thisHour >= 14){
                fetchData(false);     
            }
            else{
                getQuote('tomorrow');
            }
            localStorage.setItem('fetchedAPI_noCookieFound', true);
            return;
        }
        
        const todayDateString = today.getDate().toString() + today.getMonth().toString() + today.getFullYear().toString;
        const cookieDateString = cookieDate.getDate().toString() + cookieDate.getMonth().toString() + cookieDate.getFullYear().toString;
        const yesterdayDateString = yesterday.getDate().toString() + yesterday.getMonth().toString() + yesterday.getFullYear().toString;
        
        if(cookieDateString == todayDateString){
            // if cookie has todays date, use array for filling content
            writeData(true, thisDayArray);
            //if time is past 14:00, check nextDayCookie
            if(thisHour >= 14){
                const nextDayData = getCookieByName('nextDayCookie');
                if(nextDayData != null){
                    const nextDayArray = JSON.parse(nextDayData);
                    writeData(false, nextDayArray);
                }
                else{
                    fetchData(false);
                }
            }
            else{
                getQuote('tomorrow');
            }
            return;
        }
        else if(cookieDateString == yesterdayDateString){
            // if cookie has yesterdays date, get data from nextDayCookie, set as thisDayCookie, delete nextDayCookie and fill content
            document.cookie = "thisDayCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Strict";
            const nextDayData = getCookieByName('nextDayCookie');
            if (nextDayData != null){
                const nextDayArray = JSON.parse(nextDayData);
                setCookie('thisDayCookie', nextDayData, 2);
                // delete cookie by changing expiration
                document.cookie = "nextDayCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Strict";
                writeData(true, nextDayArray);
                localStorage.setItem('fetchedAPI_movedCookieFromYesterday', true);
                // get fresh data for next day
                if(thisHour >= 14){
                        fetchData(false);
                }
                else{
                    getQuote('tomorrow');
                }
                return;
            }

        }
        else{
            fetchData(true);
            if(thisHour >= 14){
                fetchData(false);
            }
            else{
                getQuote('tomorrow');
            }
            localStorage.setItem('fetchedAPI_noFreshCookies', true);
        }
    }

    function getCookieByName(name) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    // Function to display the data
    async function writeData(isThisDay, jsonData) {
        let sekKwh;
        let timeStart;
        let idtag = '';
        let dailyAverage = 0.0;

        const d = new Date();
        let thisHour = d.getHours();

        if(isThisDay || thisHour >= 14){
            if(isThisDay){
                idtag = 'today';
            }
            else{
                idtag = 'tomorrow';
            }

            jsonData.forEach(item =>{
                dailyAverage = dailyAverage + item.SEK_per_kWh;
            });
            dailyAverage = dailyAverage / 96;
        
            // Reset html
            const htmlOut = document.getElementById(idtag);
            htmlOut.innerHTML = ''; 

            jsonData.forEach(element => {
                sekKwh = element.SEK_per_kWh;
                timeStart = element.time_start;
                generateHtml(idtag, isThisDay, sekKwh, timeStart, dailyAverage);
            });
        }
        else{
            getQuote(idtag);
        }
    }

    /// Old API
    // Function to fetch and display the data
    async function fetchData(isThisDay) {
        let idtag = '';
        let apiUrl = '';
        if (isThisDay){
            idtag = 'today';
            const today = getFormattedDate(); // Today's date
            apiUrl = `https://www.elprisetjustnu.se/api/v1/prices/${today.year}/${today.month}-${today.day}_SE3.json`;
        }
        else {
            idtag = 'tomorrow';
            const tomorrow = getFormattedDate(1); // Tomorrow's date
            apiUrl = `https://www.elprisetjustnu.se/api/v1/prices/${tomorrow.year}/${tomorrow.month}-${tomorrow.day}_SE3.json`;
        }
        const d = new Date();
        let thisHour = d.getHours();

        const htmlOut = document.getElementById(idtag);
        htmlOut.innerHTML = ''; // Reset html
        if(isThisDay || thisHour >= 14){
            try {
                const response = await fetch(apiUrl); // Make the GET request
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const thisDayArray = await response.json(); // Parse JSON response

                if(isThisDay){
                    setCookie('thisDayCookie', JSON.stringify(thisDayArray), 2);
                }
                else{
                    setCookie('nextDayCookie', JSON.stringify(thisDayArray), 2);
                }
                
                writeData(isThisDay, thisDayArray);

            } catch (error) {
                console.error('Error fetching data:', error);
                document.getElementById(idtag).textContent = 'Failed to load data: ' + error;
            }
        }
        else{
            getQuote(idtag);
        }
    }


    /// WIP
    /*
    // Function to fetch and display the data
    async function fetchData(isThisDay) {
        let idtag = '';
        let apiUrl = '';
        if (isThisDay){
            idtag = 'today';
            const today = getFormattedDate(); // Today's date
            // whenwattapi.azurewebsites.net/GetPublic?date=2025-06-04
            apiUrl = `https://whenwattapi.azurewebsites.net/GetPublic?date=${today.year}-${today.month}-${today.day}`;
            //apiUrl = `https://www.elprisetjustnu.se/api/v1/prices/${today.year}/${today.month}-${today.day}_SE3.json`;
        }
        else {
            idtag = 'tomorrow';
            const tomorrow = getFormattedDate(1); // Tomorrow's date
            apiUrl = `https://whenwattapi.azurewebsites.net/GetPublic?date=${tomorrow.year}-${tomorrow.month}-${tomorrow.day}`;
            //apiUrl = `https://www.elprisetjustnu.se/api/v1/prices/${tomorrow.year}/${tomorrow.month}-${tomorrow.day}_SE3.json`;
        }
        const d = new Date();
        let thisHour = d.getHours();

        const htmlOut = document.getElementById(idtag);
        htmlOut.innerHTML = ''; // Reset html
        if(isThisDay || thisHour >= 14){
            try {
                const response = await fetch(apiUrl); // Make the GET request
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const thisDayArray = await response.json(); // Parse JSON response
                localStorage.setItem('testObject', JSON.stringify(thisDayArray));

                // Copy everything to clipbard...

                // addObjectToIndexedDb(thisDayArray);
                // let regionData = getRegionFromIndexedDb('SE3');

                // if(isThisDay){
                //     setCookie('thisDayCookie', JSON.stringify(regionData), 2);
                // }
                // else{
                //     setCookie('nextDayCookie', JSON.stringify(regionData), 2);
                // }
                
                // writeData(isThisDay, regionData);

            } catch (error) {
                console.error('Error fetching data:', error);
                document.getElementById(idtag).textContent = 'Failed to load data: ' + error;
            }
        }
        else{
            getQuote(idtag);
        }
    }
        */

    function addObjectToIndexedDb(rawJson){
        const request = window.indexedDB.open("RegionData");
        request.onerror = (event) => { alert('Could not access Indexed Db'); };
        request.onsuccess = (event) => {
            alert('Index Db Accessed');
        };
    }

    function getRegionFromIndexedDb(region){

    }

    function writeDateHeadlines(){
        const today = getFormattedDate(); // Today's date
        const tomorrow = getFormattedDate(1); // Today's date
        const todayText = today.year + '-' + today.month + '-' + today.day;
        const tomorrowText = tomorrow.year + '-' + tomorrow.month + '-' + tomorrow.day;
        const clockText = today.hour + ':' + today.minute;

        document.getElementById('todayDate').innerHTML = todayText;
        document.getElementById('tomorrowDate').innerHTML = tomorrowText;
        document.getElementById('clock').innerHTML = clockText;
    }

    function writeMenu(id){
        const fontstyle = 'ff-pristina';
        const fontsize = 'f-h4';
        const fontcolor = 't-lemony';
        let message = ``;

        const menu = document.getElementById(id);
        if (id == 'fxmenu'){
            message = `
Some themes are very 
demanding, your 
mileage may vary`;
        }
        
        else if (id == 'configmenu'){
            message = `
Coming soon!
Settings for region, 
currency, tax and your 
personal fees that gets 
added on top of the 
spot price.`;
        }

        else if (id == 'displaymenu'){
            message = `
Coming soon!
Selector for parts displayed
in Information-panel`;
        }

        menu.innerHTML = '';
        const newItem = document.createElement("div"); 
        newItem.className = fontcolor + ' ' + fontsize + ' ' + fontstyle; 
        newItem.innerHTML = message; 
        menu.appendChild(newItem);
    }

    function getQuote(idtag){
        const fontstyle = 'ff-brasspounder';
        const fontsize = 'f-h3';
        const fontcolor = 't-neongreen';
        const qfontstyle = 'ff-pristina';
        const qfontsize = 'f-h2';
        const qfontcolor = 't-lemony';
        const i = "<i><br/>";
        const ie = "</i>";
        const authStart = '<span class="t-goldy"><br/>';
        const authEnd = '</span>';
        const quotes = [
            `${i}\"You have come a long way to find, what you really left behind\"${ie} ${authStart} - Megadeth${authEnd}`, // 0
            `${i}\"Moving on is a simple thing, what it leaves behind is hard\"${ie} ${authStart} - Megadeth${authEnd}`, // 1
            `${i}\"I wasted my time 'til time wasted me\"${ie} ${authStart} - Savatage${authEnd}`, // 2
            `${i}\"All of us get lost in the darkness, dreamers learn to steer by the stars\"${ie} ${authStart} - Rush${authEnd}`, // 3
            `${i}\"Kill a man and you're a murderer, kill many and you're a conqueror\"${ie} ${authStart} - Megadeth${authEnd}`, // 4
            `${i}\"You will wear your independence like a crown\"${ie}${authStart} - Ghost${authEnd}`, // 5
            `${i}\"Don't waste your time always searching for those wasted years. Face up, make your stand and realise you're living in the golden years\"${ie} ${authStart} - Iron Maiden${authEnd}`, // 6
        ];
        const rndNum = Math.floor(Math.random() * quotes.length); // rnd 0-9
        const thisQuote = quotes[rndNum];
        localStorage.setItem('Number of quotes', quotes.length.toString())
        const htmlOut = document.getElementById(idtag);
        htmlOut.innerHTML = '';
        const newRow = document.createElement("div"); 
        newRow.className = fontcolor + ' ' + fontsize + ' ' + fontstyle + ' linebreak'; 
        newRow.innerHTML = `Available after 14:00\n\n`; 
        const newRowQuote = document.createElement("div"); 
        newRowQuote.className = qfontcolor + ' ' + qfontsize + ' ' + qfontstyle + ' linebreak'; 
        newRowQuote.innerHTML = thisQuote; 
        htmlOut.appendChild(newRow);
        htmlOut.appendChild(newRowQuote);
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict";
    }

    function generateHtml(idtag, isThisDay, _sekKwh, _timeStart, dailyAverage){
        const fontstyle = 'ff-avignon-bi';
        const htmlOut = document.getElementById(idtag);
        let fontcolor = '';
        const sekFloat = parseFloat(_sekKwh).toFixed(3);
        if (sekFloat <= 0.3){
            fontcolor = 't-great'
        }
        else if (sekFloat > 0.3 && sekFloat <= 0.6){
            fontcolor = 't-good'
        }
        else if (sekFloat > 0.6 && sekFloat <= 1.0){
            fontcolor = 't-ok'
        }
        else if (sekFloat > 1.0 && sekFloat <= 1.8){
            fontcolor = 't-caution'
        }
        else if (sekFloat > 1.8 && sekFloat <= 2.5){
            fontcolor = 't-warning'
        }
        else if (sekFloat > 2.5){
            fontcolor = 't-warning_2'
        }

        const reald = new Date();
        let currentHour = reald.getHours();
        const d = new Date(_timeStart); // Create a Date instance
        let hour = d.getHours(); // Get the current hour
        let firstHour = ("0" + hour).slice(-2);
        const newRow = document.createElement("div");
        newRow.className = 'hourlybutton';
        const spanContent = document.createElement("span");
        spanContent.className = fontcolor + ' ' + fontstyle;
        if(currentHour == hour && isThisDay){
            spanContent.textContent = `—  ${firstHour}:00 - ${sekFloat}  —`;
            //setCookie(currentPrice, sekFloat, 2);
            writeInfo(sekFloat, fontstyle, dailyAverage);
        }
        else{
            spanContent.textContent = `${firstHour}:00 - ${sekFloat}`;
        }
        newRow.appendChild(spanContent);
        htmlOut.appendChild(newRow);
    }

    function writeInfo(currentPrice, fontstyle, dailyAverage){
        const headlinefont = 'ff-devinneswash';
        const fontsize = 'f-h3';
        const headlinecolor = 't-ok';
        const fontcolor = 't-orangeburst';
        const kWm = currentPrice / 60;
        const sectionCare = true;
        const sectionHeating = true;
        const sectionPizza = true;
        const sectionKitchen = true;
        const sectionEntertainment = true;
        const sectionHousehold = true;
        const sectionMisc = true;


        // Arrays: name, kWh, minutes, info
        const careArray = [
            ['Shower (10m)', 6, 10], 
            ['Bath (150l)', 7, 30],
            ['Hairdryer (10m)', 0.25, 10]  
            ];
        const heatingArray = [
            ['Air Heater 24h (High)', 1.5, 60], 
            ['Air Heater 24h (Medium)', 1.0, 60], 
            ['Air Heater 24h (Low)', 0.5, 60], 
            ['Oil Radiator 24h (1000w)', 0.5, 60], 
            ['Convector 24h (1000w)', 0.7, 60],
            ['Air Heater (High)', 1.5, 60], 
            ['Air Heater (Medium)', 1.0, 60], 
            ['Air Heater (Low)', 0.5, 60], 
            ['Oil Radiator (1000w)', 0.5, 60], 
            ['Convector (1000w)', 0.7, 60]
            ];
        const pizzaArray = [
            ['Preheating (300c)', 2.5, 10], 
            ['Heating (300c)', 2.5, 60], 
            ['Baking (5m)', 0.2, 5] 
            ];
        const kitchenArray = [
            ['Electric Kettle (1l)', 0.1, 5], 
            ['Microwave Oven (10m)', 0.15, 10], 
            ['Stove (30m, Coil)', 1.25, 30],
            ['Stove (30m, Induction)', 1.0, 30],
            ['Stove (30m, Gas)', 2.5, 30]
            ];
        const entertainmentArray = [
            ['Watching TV (55\")', 0.10, 60], 
            ['Watching TV (75\")', 0.11, 60], 
            ['Console Gaming', 0.25, 60], 
            ['Laptop', 0.05, 60], 
            ['Omen Laptop', 0.13, 60], 
            ['Steam Deck', 0.035, 60], 
            ['Smartphone', 0.01, 60],
            ['Charging Smartphone', 0.04, 60]
            ];
        const householdArray = [
            ['Dishwasher (Old)', 2, 150], 
            ['Dishwasher (New)', 1, 150], 
            ['Laundry (Old)', 2.5, 150],
            ['Laundry (New)', 0.5, 150],
            ['Laundry Tumbler', 5, 120],
            ['Vacuuming', 1, 60],
            ['Ironing', 2, 60]
            ];
        const miscArray = [
            ['LED bulb 15w', 0.015, 60], 
            ['LED bulb 7.5w', 0.0075, 60], 
            ['WhenWatt', 0.003, 60] 
            ];

        const information = document.getElementById('info');

        const priceNow  = 'Currently: ' + currentPrice + ' SEK'; 
        const priceAverage  = 'Daily Avg: ' + dailyAverage.toFixed(3) + ' SEK'; 

        information.innerHTML = '';
        createInfoHeadline(priceNow, 'info', headlinefont, headlinecolor);
        createInfoHeadline(priceAverage, 'info', headlinefont, headlinecolor);
        createBreak('info');
        // item[0] = title, item[1] = useage, item[2] = minutes, 
        if(sectionHeating){ 
            createInfoHeadline('Heating', 'info', headlinefont, headlinecolor); 
            heatingArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        if(sectionHousehold){ 
            createInfoHeadline('Household', 'info', headlinefont, headlinecolor); 
            householdArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        if(sectionCare){ 
            createInfoHeadline('Personal Care', 'info', headlinefont, headlinecolor); 
            careArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        if(sectionKitchen){ 
            createInfoHeadline('Kitchen', 'info', headlinefont, headlinecolor); 
            kitchenArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        if(sectionPizza){ 
            createInfoHeadline('Pizza', 'info', headlinefont, headlinecolor); 
            pizzaArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        if(sectionEntertainment){ 
            createInfoHeadline('Entertainment', 'info', headlinefont, headlinecolor); 
            entertainmentArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        if(sectionMisc){ 
            createInfoHeadline('Misc', 'info', headlinefont, headlinecolor); 
            miscArray.forEach(item => {
                createInfoContent(currentPrice, item[0], item[1], 'info', fontstyle, fontcolor, dailyAverage);
            });
            createBreak('info');
        }
        createBreak('info');
        createBreak('info');
        createBreak('info');
    }

    function createBreak(idtag){
        const information = document.getElementById(idtag);
        const newItem = document.createElement("br"); 
        information.appendChild(newItem);
    }

    function createInfoHeadline(title, idtag, fontstyle, headlinecolor){
        //const fontstyle = 'ff-pristina';
        const fontsize = 'f-h3';
        const fontcolor = headlinecolor;
        const information = document.getElementById(idtag);

        const newItem = document.createElement("div"); 
        newItem.className = fontcolor + ' ' + fontsize + ' ' + fontstyle; 
        newItem.innerHTML = title; 
        information.appendChild(newItem);

    }

    function createInfoContent(currentPrice, title, kwhused, idtag, fontstyle, fontcolor, dailyAverage){
        const fontsize = 'f-costs';
        const cost = currentPrice * kwhused;
        const dailyCost = kwhused * dailyAverage * 24;
        const priceHLStart = '<span class="t-cost">';
        const priceHLEnd = '</span>';
        let priceInfo  = ''; 
        if(title.includes('24h')){
            priceInfo = `${title}: ${priceHLStart}${dailyCost.toFixed(2)}${priceHLEnd} SEK`; 
        }
        else{
            priceInfo = `${title}: ${priceHLStart}${cost.toFixed(2)}${priceHLEnd} SEK`; 
        }
        

        const information = document.getElementById(idtag);

        const newItem = document.createElement("div"); 
        newItem.className = fontcolor + ' ' + fontsize + ' ' + fontstyle + ' infozoom'; 
        newItem.innerHTML = priceInfo; 
        information.appendChild(newItem);
    }

    function getFormattedDate(offsetDays = 0) {
        const date = new Date();
        date.setDate(date.getDate() + offsetDays); // Add offset days to the date

        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return { year, month, day, hour, minute };
    }
    // Show Hide //
    function show(id) {
        document.getElementById(id).style.display = "flex";
        document.getElementById(id).style.visibility = "visible";
    }

    function hide(id) {
        document.getElementById(id).style.display = "none";
        document.getElementById(id).style.visibility = "hidden";
    }

    function showhide(id) {
        if (document.getElementById(id).style.display == 'flex') {
            hide(id);
        }
        else {
            show(id);
        }
    }

    // Wallpaper swapper //
    function wallpapermod(wallpaper, createCookie, opacity_value) {
        const basePath = window.location.pathname.split('/').slice(0, -1).join('/'); // Removes the file name (if any)
        const imageurl = `url('${basePath}/images/bgimg/${wallpaper}')`;
        document.getElementById("bgimage").style.backgroundImage = imageurl;
        document.getElementById("bgimage").style.setProperty('opacity', opacity_value);
        if (createCookie){
        setCookie('wallpaper', wallpaper, 90);
        setCookie('wallpaper_opacity', opacity_value, 90);
        }
    }

    function mywidth(){
        const thiswidth = screen.availWidth;
        alert(thiswidth);
    }

    function swapfx(fxname_in){
        const divId = 'bgfx';
        let fxname = fxname_in;
        const fxId = document.getElementById('bgfx');
        if (fxname == null || fxname == ''){
            fxname = 'starfield';
            wallpapermod('stars_bg1.svg', true, 1.0);
        }
        setCookie('selectedfx', fxname, 90);
        wallpapermod('', false);
        fxId.innerHTML = '';
        const arrays = {
            none: [
                ''
            ],
        starfield: [
            'stars_near',
            'stars_near_loop',
            'stars_far',
            'stars_far_loop',
            'stars_whereveryouare',
            'stars_whereveryouare_loop'
        ],
        starfieldheavy: [
            'stars-bg-fade1',
            'stars-bg-fade2',
            'stars_near',
            'stars_near_loop',
            'stars_far',
            'stars_far_loop',
            'stars_whereveryouare',
            'stars_whereveryouare_loop'
        ],
        mountains: [
            'bg-trees_sun',
            'bg-trees_left',
            'bg-trees_right'
        ],
        circles: [
            'floating-base',
            'floating-bg',
            'floating-bg-layer',
            'interference_one',
            'interference_two'
        ],
        // longspin: [
        //     'longspin_f',
        //     'longspin_f_loop',
        //     'longspin_f2',
        //     'longspin_f2_loop',
        //     'longspin_b',
        //     'longspin_b_loop',
        //     'longspin_b2',
        //     'longspin_b2_loop'
        // ],
        wave: [
            'floating-base',
            'floating-bg',
            'floating-bg-layer',
            'wave_1',
            'wave_2',
            'wave_3'
        ],
        buugeng: [
            // 'imagebg',
            'buugeng_1',
            'buugeng_2'
        ],
        colorfade: [
            'floating-base',
            'floating-bg',
            'floating-bg-layer'
        ],
        rotor: [
            'floating-base',
            'floating-bg',
            'floating-bg-layer',
            'pattern'
        ],
        vapor: [
            'vaporware_grid',
            'vaporware_sun'
        ]
        };

        const thisArray = arrays[fxname];

        if (thisArray != null){
            thisArray.forEach(item =>{
                createDiv(item, divId);
            })
        };
        const wallpaperCookie = getCookieByName('wallpaper');
        const wallpaper_opacity_value = parseFloat(getCookieByName('wallpaper_opacity'));
        wallpapermod(wallpaperCookie, false, wallpaper_opacity_value);
    }


    function createDiv(divname, divid){
        const target = document.getElementById(divid);
        const newItem = document.createElement("div"); 
        newItem.className = divname; 
        target.appendChild(newItem);
    }

    function showfx(id) {
        document.getElementById(id).style.display = "block";
        document.getElementById(id).style.visibility = "visible";
        document.getElementById(id).style.position = "fixed";
    }

    function hidefx(id) {
        document.getElementById(id).style.display = "none";
        document.getElementById(id).style.visibility = "hidden";
        document.getElementById(id).style.position = "absolute";
    }

    function showhidefx(id) {
        if (document.getElementById(id).style.display == 'block') {
            hidefx(id);
        }
        else {
            showfx(id);
        }
    }