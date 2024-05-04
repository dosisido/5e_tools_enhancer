
async function main(){
    await sleep(2 * 1000);
    console.log('5e Tools Enhancer Extension loaded');


    const selectors = [
        "div.cancer__wrp-leaderboard",
        "body > div.viewport-wrapper > div > div.w-100.no-shrink"
    ];
    for(const selector of selectors){
        waitForElement(selector, 15)
            .then((element) => {
                element.remove();
            })
            .catch((err) => console.log(err));
    }

    (async () => {
        await sleep(3 * 1000);
        while (!document.body.textContent.includes('feet')) {
            await sleep(3 * 1000);
        }
        executeOnTextNodes(document.body, convertText);
        return;
    })();




    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // console.log('A child node has been added or removed.');
                executeOnTextNodes(document.body, convertText);
            }
            else if (mutation.type === 'attributes') {
                // console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // observer.disconnect();
}
    


function executeOnTextNodes(element, callback) {
    // If the element is a text node, convert the distances in its textContent
    if (element.nodeType === Node.TEXT_NODE) {
        element.textContent = callback(element.textContent);
    } else {
        // If the element is not a text node, recursively explore its child nodes
        element.childNodes.forEach(e => executeOnTextNodes(e, callback));
    }
}


function convertText(text) {
    function convertFeetToMeters(feet) {
        return Math.floor((feet / 5 * 1.5) * 100) / 100;
    }
    function convertPoundsToKg(pounds) {
        return Math.floor(pounds / 2.20462);
    }

    text = text.replace(' ', ' ');

    const pattern_feet = /(\d{1,4})[ -]f[eo]{0,2}t/gmi;
    text = text.replace(pattern_feet, (match, value) => {
        const meters = convertFeetToMeters(value);
        // const sep = (item.match.includes('-')) ? '-' : ' ';
        const sep = '';
        return `${meters}${sep}m`
    });

    const pattern_feet_between = /(\d{1,4})([ \-\w\D\/]{1,10}?)(\d{1,4})[\s\-]*?f[eo]{0,2}t\.?/gmi;
    text = text.replace(pattern_feet_between, (match, value1, sep, value2) => {
        const m1 = convertFeetToMeters(value1);
        const m2 = convertFeetToMeters(value2);
        return `${m1}${sep}${m2}kg`
    });

    const pattern_mile = /(\d{1,4})[ -]miles?/gmi;
    text = text.replace(pattern_mile, (match, value) => {
        const meters = Math.floor(value * 1.609);
        return `${meters}km`
    });

    const pattern_pounds_between = /(\d{1,4})([ \-\w]{0,10}?)(\d{1,4})[ -](?:pounds|lb)/gmi;
    text = text.replace(pattern_pounds_between, (match, value1, sep, value2) => {
        const kg1 = convertPoundsToKg(value1);
        const kg2 = convertPoundsToKg(value2);
        return `${kg1}${sep}${kg2}kg`
    });

    const pattern_pounds = /(\d{1,4})[ -](?:pounds|lb)/gmi;
    text = text.replace(pattern_pounds, (match, value) => {
        const kg = convertPoundsToKg(value);
        return `${kg}kg`
    });

    return text;
}

function waitForElement(selector, timeout = 0 /* seconds */) {
  return new Promise(async (resolve, reject) => {
    if (timeout > 0)
      setTimeout(() => reject("Timeout reached"), timeout * 1000);
    while (1) {
      const element = document.querySelector(selector);
      if (element) return resolve(element);
      await sleep(500);
    }
  });
}

function sleep(ms /* milliseconds */) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const interval = 1.5 * 60 * 1000; // 1 minute e mezzo
main(); 
