let allPetsData = [];

const loadPetsCategories = async () => {
    showSpinner(true);
    const data = await fetchData('https://openapi.programming-hero.com/api/peddy/categories');
    if (data) {
        displayPetsCategories(data.categories);
        setTimeout(loadAllPets, 3000);
    }
};

const loadAllPets = async () => {
    const data = await fetchData('https://openapi.programming-hero.com/api/peddy/pets');
    if (data) {
        allPetsData = data.pets;
        displayPets(allPetsData);
        showSpinner(false);
    }
};

const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

const showSpinner = (isVisible) => {
    document.getElementById('spinner').style.display = isVisible ? "block" : "none";
};

const sortPetsByPrice = () => {
    displayPets([...allPetsData].sort((a, b) => a.price - b.price));
};

document.getElementById('sortButton').addEventListener('click', sortPetsByPrice);

const categoriesPets = async (name, button) => {
    showSpinner(true);
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = '<div class="spinner"></div>';

    const data = await fetchData(`https://openapi.programming-hero.com/api/peddy/category/${name}`);
    if (data) {
        displayPets(data.data);
        setActiveButton(button);
    }
};

const displayPets = (pets) => {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = "";
    
    if (pets.length === 0) {
        displayNoPetsMessage(petsContainer);
        return;
    }
    
    petsContainer.classList.add("grid");
    pets.forEach(pet => petsContainer.appendChild(createPetCard(pet)));
};

const createPetCard = (pet) => {
    const { image, pet_name, breed, date_of_birth, gender, price, petId } = pet;
    const card = document.createElement('div');
    card.innerHTML = `
        <div class="card border h-full w-full lg:max-w-[300px] ">
            <figure class="px-3 pt-3">
                <img class="w-full lg:w-[350px] h-[200px] object-cover rounded-xl" src="${image}" alt="${pet_name}" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">${pet_name}</h2>
                ${createPetInfo('fa-paw', 'Breed', breed)}
                ${createPetInfo('fa-cake-candles', 'Birth', date_of_birth)}
                ${createPetInfo('fa-mercury', 'Gender', gender)}
                ${createPetInfo('fa-dollar-sign', 'Price', price)}
                <hr class="border-t border-gray-300 my-4">
                <div class="card-actions justify-between">
                    <button onclick="petImage('${image}')" class="btn lg:btn-sm text-oceanBlue btn-outline">
                        <i class="fa-solid fa-thumbs-up"></i>
                    </button>
                    <button class="btn lg:btn-sm btn-outline text-oceanBlue font-bold adopt-btn" onclick="adoptPet(this)">Adopt</button>
                    <button onclick="petDetails('${petId}')" class="btn lg:btn-sm btn-outline text-oceanBlue font-bold">Details</button>
                </div>
            </div>
        </div>
    `;
    return card;
};

const createPetInfo = (iconClass, label, value) => `
    <div class="flex justify-center space-x-2 items-center">
        <i class="fa-solid ${iconClass}"></i>
        <p>${label}: ${value || "No data available"}</p>
    </div>
`;

const displayNoPetsMessage = (container) => {
    container.classList.remove("grid");
    container.innerHTML = `
        <div class="flex flex-col gap-5 justify-center items-center">
            <img class="mx-auto" src="./images/error.webp" alt="No data available" />
            <h2 class="text-center text-2xl font-bold">No Information Available</h2>
            <p class="text-black text-center">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at
                its layout. The point of using Lorem Ipsum is that it has a.
            </p>
        </div>
    `;
};

const displayPetsCategories = (categories) => {
    const categoryContainer = document.getElementById('petButtons');
    categoryContainer.innerHTML = '';
    categories.forEach(category => {
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <button onclick="categoriesPets('${category.category}', this)" class="btn btn-outline font-bold btn-wide btn-lg">
                <img class="w-8" src="${category.category_icon}" alt=""/>
                ${category.category}
            </button>
        `;
        categoryContainer.appendChild(buttonContainer);
    });
};

const setActiveButton = (button) => {
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
};

const petImage = (image) => {
    const petPhotoContainer = document.getElementById('petPhoto');
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="px-3 py-3 border rounded-xl">
            <img class="rounded-xl object-cover" src="${image}" alt="" />
        </div>
    `;
    petPhotoContainer.appendChild(div);
};

const adoptPet = (button) => {
    if (button.textContent === 'Adopt') {
        let countdown = 3;
        const modal = document.getElementById('adoptModal');
        modal.classList.remove('hidden');
        document.getElementById('adoptModalImage').src = './images/error.webp';
        document.getElementById('adoptModalTitle').textContent = 'Adopting...';

        const countdownInterval = setInterval(() => {
            document.getElementById('adoptModalCountdown').textContent = countdown;
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                button.textContent = 'Adopted';
                button.disabled = true;
                button.style.color = 'black';
                document.getElementById('adoptModalTitle').textContent = 'Adoption complete!';
                setTimeout(() => modal.classList.add('hidden'), 2000);
            }
        }, 1000);
    }
};

const petDetails = async (petId) => {
    const data = await fetchData(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = createPetDetailsModal(data.petData);
    document.getElementById('my_modal_1').showModal();
};

const createPetDetailsModal = (petData) => `
    <dialog id="my_modal_1" class="modal">
        <div class="modal-box" style="background-color: white; border-radius: 0.5rem; padding: 1rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
            <figure>
                <img class="w-full h-[200px] object-cover rounded-xl" src="${petData.image}" alt="${petData.pet_name}" />
            </figure>
            <h2 class="card-title font-bold">${petData.pet_name}</h2>
            <div class="flex items-start">
                <div class="flex flex-col justify-start items-start">
                    ${createPetInfo('fa-paw', 'Breed', petData.breed)}
                    ${createPetInfo('fa-mercury', 'Gender', petData.gender)}
                    ${createPetInfo('fa-syringe', 'Vaccinated Status', petData.vaccinated_status)}
                </div>
                <div class="flex flex-col justify-start items-start">
                    ${createPetInfo('fa-cake-candles', 'Birth', petData.date_of_birth)}
                    ${createPetInfo('fa-dollar-sign', 'Price', petData.price)}
                </div>
            </div>
            <hr class="border-t border-gray-300 my-4">
            <div>
                <h2 class="card-title text-lg font-bold">Detail Information</h2>
                <p>${petData.pet_details}</p>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn bg-white text-oceanBlue btn-outline">Close</button>
                </form>
            </div>
        </div>
    </dialog>
`;

loadPetsCategories();