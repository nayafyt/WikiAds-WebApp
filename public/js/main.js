// Put your client side JS code here
console.log('using main.js');

var ids = [];
var categoryDiv = document.createElement('div');

//let indexScript = document.getElementById("category-template");
//templates.index = Handlebars.compile(indexScript.textContent)
const url = 'https://wiki-ads.onrender.com/categories';
const subcategoryUrl = 'https://wiki-ads.onrender.com/categories/:id/subcategories';

async function fetchCategories() {
    const response = await fetch(url);
    return response.json();
}

async function fetchSubcategory(category_id) {
    const url = subcategoryUrl.replace(':id', category_id);
    const response = await fetch(url);
    return response.json();
}

async function loadData() {
    categoriesArray = await fetchCategories();

    for (var i = 0; i < categoriesArray.length; i++) {
        subcategory = await fetchSubcategory(categoriesArray[i].id)

        categoriesArray[i].subcategories = subcategory;
    }
    
    var source = document.getElementById('category-template').innerHTML;
    var template = Handlebars.compile(source);
    var html = template(
        { 
            categories: categoriesArray,
        }
    );
    
    console.log("Categories:");
    console.log(categoriesArray);
    
    document.getElementById('categories').innerHTML = html;
}

loadData();
