const btnContainer = document.getElementById('btn-container');

let selectedCategory = '1000';
let sortByView = false;
const sortBtn = document.getElementById('sortViewBtn');
sortBtn.addEventListener('click', function(){
    console.log('sortByView');
    sortByView = true;
    fetchDataByCategory(selectedCategory, sortByView);
})

const fetchCategory = async () => {
    const url = `https://openapi.programming-hero.com/api/videos/categories`
    const res = await fetch(url);
    const data = await res.json();
    const allData = data.data;
    allBtnData(allData); 
};

// display all button 
function allBtnData(allData){

    allData.forEach(card => {
        const newBtn = document.createElement('button')
        newBtn.classList = `category-btn text-lg font-semibold btn btn-sm bg-rbg capitalize hover:bg-[red] hover:text-white rounded-md`
        newBtn.innerText = card.category
        newBtn.addEventListener('click', function(event){
            const allBtn = document.querySelectorAll('.category-btn');
            for(let btn of allBtn){
                btn.classList.remove('bg-[red]', 'text-white');
            }
            newBtn.classList.add('bg-[red]', 'text-white');
        allDataByCategoryId(card.category_id)
        })
        btnContainer.appendChild(newBtn) 
    })
}


// ALL data by categoryId
const allDataByCategoryId = async (id, sortByView) => {
    const url = `https://openapi.programming-hero.com/api/videos/category/${id}`
    const res = await fetch(url);
    const data = await res.json();
    const categoryId = data.data
    fetchDataByCategory(categoryId, sortByView);
};


function fetchDataByCategory(categoryId, sortByView){
    
    selectedCategory = categoryId
    const emptyContent = document.getElementById('empty-content');
    const categoriesLength = categoryId.length;

    if (sortByView){
        categoryId.sort((a, b) =>{
            const totalViewsFirst = a.others?.views
            const totalViewsSecond = b.others?.views
            const totalViewsFirstNumber = parseFloat(totalViewsFirst.replace('K', '')) || 0;
            const totalViewsSecondNumber = parseFloat(totalViewsSecond.replace('K', '')) || 0;
            return totalViewsSecondNumber - totalViewsFirstNumber
        })
    }

    if(categoriesLength == 0){
        emptyContent.classList.remove('hidden');
    }
    else{
        emptyContent.classList.add('hidden');
    }

    const cards = document.getElementById('cards');
    cards.innerText = '';
    
    categoryId.forEach(singleCard => {
        
        let image = ``;
        if(singleCard.authors[0].verified){
            image = `<img src="./images/verify.png" class="w-6 h-6" alt="" />`
        }

    const div = document.createElement('div');
    div.classList = `card w-full bg-base-100 shadow-2xl relative`
    div.innerHTML =`
   <img
          src="${singleCard.thumbnail}"
          class="max-h-40 rounded-md"
          alt=""
        />

        <div
          class="badge badge-lg rounded-lg px-3 border-black badge-primary text-white bg-black absolute top-32 right-2"
        >
          4hrs 31min ago
        </div>
        <div class="card-body flex-row gap-5 px-5">
          <div>
            <img
              class="w-16 h-16 rounded-full"
              src="${singleCard.authors[0].profile_picture}"
              alt=""
            />
          </div>
          <div>
            <h2 class="text-base font-semibold">${singleCard.title}</h2>
            <h3 class="flex gap-2 items-center py-2">
              <span>${singleCard.authors[0].profile_name}</span>
              ${image}
            </h3>
            <p>${singleCard.others.views} Views</p>
          </div>
        </div>
   `
   cards.appendChild(div);
   })
}

fetchCategory();
allDataByCategoryId(selectedCategory, sortByView)