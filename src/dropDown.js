export class dropDown {
    constructor(parentNode, buttonText, listOfItems){
        this.buttonText = buttonText;
        this.items = listOfItems;
        this.parent = parentNode;
        this.iconURL = document.createElement('link');
        this.container = document.createElement("div");
        this.dropDownButton = document.createElement("button");
        this.arrowIcon = document.createElement("span");
        this.dropDownItems = document.createElement("div");
        this.buttonTextElement = document.createElement("div");
    }
    
    createDropdown() {
        this.iconURL.rel = "stylesheet"
        this.iconURL.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        document.head.appendChild(this.iconURL);
    
        this.container.classList.add("dropDownContainer");
        this.dropDownButton.classList.add("dropDownButton");
        this.arrowIcon.classList.add("material-symbols-outlined");
        this.dropDownItems.classList.add("dropDownItems");

        
    
        this.buttonTextElement.innerHTML = this.buttonText;
        this.dropDownButton.type = "button";
        this.arrowIcon.innerHTML = "expand_less";
        for (const item of this.items) {
            this.addDropDownItem(item)
        }
        
        this.dropDownButton.appendChild(this.buttonTextElement);
        this.dropDownButton.appendChild(this.arrowIcon);
        this.container.appendChild(this.dropDownButton);
        this.container.appendChild(this.dropDownItems);
    
        this.parent.appendChild(this.container);
    
    }

    addDropDownItem(itemName) {
        const newItem = document.createElement("a");
        newItem.innerHTML = itemName;
        newItem.classList.add("item");
        this.dropDownItems.appendChild(newItem);
    }

    initiateDropDown() {
        this.dropDownButton.addEventListener('click', () => {
            this.arrowIcon.classList.toggle("rotateIconDown");
            setTimeout(() => {
                this.dropDownItems.classList.toggle("visible");
            }, 250)
            
        })
    }

}

// exports.dropDown