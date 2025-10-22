const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

//data output//
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languagesOutput = document.querySelector(".languages");

//loop through all countries//
countries.forEach(country =>{
    //add mouse enter to each country (cursor enter a country)
    country.addEventListener("mouseenter", function() {
        //get all classes of element the mouse enters
        const classList = [...this.classList].join('.');
        console.log(classList);
          //create a selector for matching classes
          const selector = '.' + classList;
          /* Select all matching elements
              select all pieces of land (svg paths)
              that belong to the same country */
          const matchingElements = document.querySelectorAll(selector);
        //add hover effect to matching elements
        matchingElements.forEach(el => el.style.fill = "#c99aff");
    });
    //add a mouse out event (cursor leaves a country)
    country.addEventListener("mouseout", function() {
        /* Repeat the same steps from before to remove hovered
           style from matching elements. Remove hovered effect
           from all pieces of land (svg paths) that have the
           same class names (belong to the same country). */
        const classList = [...this.classList].join('.');
        const selector = '.' + classList;
        const matchingElements = document.querySelectorAll(selector);
        matchingElements.forEach(el => el.style.fill = "#443d4b");
    });
    //add click event to each country
    country.addEventListener("click", function(e){
        //set loading text
        loading.innerText = "Loading...";
        //hide country data container
        container.classList.add("hide");
        //show loading screen
        loading.classList.remove("hide");
        //variable to hold the country name
        let clickedCountryName;
        //if the clicked svg path (country) has a name attribute
        if(e.target.hasAttribute("name")){
            //get the value of the name attribute (country name)
            clickedCountryName = e.target.getAttribute("name");
        } else{
            //get the class name (country name)
            clickedCountryName = e.target.classList.value;
        }
        //open the side panel
        sidePanel.classList.add("side-panel-open");
    //use fetch to get data from the API (add the extracted country name)
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
        .then(response => {
            //check if the response is ok (status code 200)
            if (!response.ok){
                throw new Error('Network response was not ok');
            }
            //parse the response as JSON
            return response.json();
        })
        .then(data =>{
            /*you can console log the data
            and view it in the developer console */
            console.log(data);
            //delay the code inside for half a second
            setTimeout(()=>{
                //extract data and output the side panel
                //country name
                countryNameOutput.innerText = data[0].name.common;
                //flag image
                countryFlagOutput.src = data[0].flags.png;
                //capital city
                cityOutput.innerText = data[0].capital;
                //area
                //change number format to include dots in big numbers
                const formatedNumber = data[0].area.toLocaleString('de-DE');
                areaOutput.innerHTML = formatedNumber + ' km<sup>2</sup>';
                //currency
                //get the currencies object
                const currencies = data[0].currencies;
                /*set currency output to empty string
                (remove data from previous country) */
                currencyOutput.innerText = "";
                //loop through each object key
                Object.keys(currencies).forEach(key =>{
                    //output the name of each currency of the selected country
                    currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
                });
                //languages (repeat the same steps as with the currency object)
                const languages = data[0].languages;
                languagesOutput.innerText = "";
                Object.keys(languages).forEach(key => {
                    languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
                });
                //wait for new flag image to load
                countryFlagOutput.onload = () =>{
                    //show the container with country info
                    container.classList.remove("hide");
                    //hide loading screen
                    loading.classList.add("hide");
                };
            },500);
        })
        //handle errors
        .catch(error => {
            //output explaination for the user
            loading.innerText = "No data to show for selected country";
            //console log the error
            console.error("There was a problem with the fetch operation:", error);
        });
    });
});

//add click event to side panel close button
closeBtn.addEventListener("click", () => {
    //close the side panel
    sidePanel.classList.remove("side-panel-open");
});

//variable to contain the current zoom value
let zoomValue = 100;
//disable zoom out button on load
zoomOutBtn.disabled = true;
//add click event to zoom in button
zoomInBtn.addEventListener("click", () => {
    //enable the zoom out button
    zoomOutBtn.disabled = false;
    //increment zoom value by 100
    zoomValue += 100;
    /*if the zoom value is under 500
    (or whatever you want the zoom in limit to be) */
    if(zoomValue < 500) {
        //enable the zoom in button
        zoomInBtn.disabled = false;
    //and if it eaches the limit
    } else {
       zoomInBtn.disabled = true; 
    }
    //set map width and height to zoom value
    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";
    //output zoom value percentage
    zoomValueOutput.innerText = zoomValue + "%";
});
/** repeat the same process with the zoom out button
 * just decrement the zoom value by 100 and check if it
 * is over 100*/
zoomOutBtn.addEventListener("click",() => {
    zoomInBtn.disabled = false;
    zoomValue -= 100;
    if(zoomValue > 100) {
        zoomOutBtn.disabled = false;
    } else {
        zoomOutBtn.disabled = true;
    }
    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";
    zoomValueOutput.innerText = zoomValue + "%";
});
