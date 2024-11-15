async function clothChrome() {
    let step1 = window.location.href.split('/catalog/').pop();
    if (step1) {
        let assetID = step1.split("/")[0];
        if (!isNaN(assetID)) {
            async function JsonRequest(assetId) {
                const JSONresponse = await fetch("https://assetdelivery.roblox.com/v1/assetId/" + assetId);
                const JSONdata = await JSONresponse.json();
                return JSONdata["location"];
            };
            
            // Parse XML Data
            const JsonRes = await JsonRequest(assetID)
            const XMLresponse = await fetch(JsonRes);
            const XMLdata = await XMLresponse.text();

            let Xmlparser = new DOMParser();
            let xmlDoc = Xmlparser.parseFromString(XMLdata, "text/xml");
            // Check If Item Type Is Supported
            const AllowedItemTypes = ["Pants", "Shirt", "Shirt Graphic"];
            let xmlItemType = xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue;

            if (AllowedItemTypes.includes(xmlItemType)) {
                let xmlUrl = xmlDoc.getElementsByTagName("url")[0];
                let parXML = xmlUrl.childNodes[0].nodeValue;

                if (parXML) {
                    let ImageLocation = await JsonRequest(parXML.split("?id=").pop());
                    return [ImageLocation, xmlItemType];
                };
            };
        };
    };
};

chrome.action.onClicked.addListener(async (tab) => {
    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: clothChrome
      }).then(injectionResults => {
        if (injectionResults) {
            const { fId, result } = injectionResults[0];
            if (result) {
                chrome.downloads.download({ url: result[0], filename: result[1] + ".png"} );
            };
        };
    });
});