// Configuration
const API_KEY = 'YOUR_SPOONACULAR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.spoonacular.com/recipes';

// DOM Elements
const ingredientInput = document.getElementById('ingredientInput');
const addBtn = document.getElementById('addBtn');
const searchBtn = document.getElementById('searchBtn');
const ingredientTags = document.getElementById('ingredientTags');
const recipesContainer = document.getElementById('recipesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsTitle = document.getElementById('resultsTitle');
const noResults = document.getElementById('noResults');
const recipeCount = document.getElementById('recipeCount');

// State
let ingredients = [];

// Event Listeners
addBtn.addEventListener('click', addIngredient);
ingredientInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addIngredient();
});
searchBtn.addEventListener('click', searchRecipes);

// Functions
function addIngredient() {
    const ingredient = ingredientInput.value.trim();
    
    if (!ingredient) {
        alert('Please enter an ingredient name');
        return;
    }
    
    if (ingredients.includes(ingredient.toLowerCase())) {
        alert('This ingredient is already in your fridge!');
        return;
    }
    
    ingredients.push(ingredient.toLowerCase());
    ingredientInput.value = '';
    renderTags();
    updateSearchButton();
    ingredientInput.focus();
}

function removeIngredient(ingredient) {
    ingredients = ingredients.filter(ing => ing !== ingredient);
    renderTags();
    updateSearchButton();
}

function renderTags() {
    if (ingredients.length === 0) {
        ingredientTags.innerHTML = '<p class="empty-message">No ingredients yet. Add some to get started!</p>';
        return;
    }
    
    ingredientTags.innerHTML = ingredients.map(ing => `
        <div class="tag">
            <span>${capitalizeFirst(ing)}</span>
            <button type="button" onclick="removeIngredient('${ing}')">✕</button>
        </div>
    `).join('');
}

function updateSearchButton() {
    searchBtn.disabled = ingredients.length === 0;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function searchRecipes() {
    if (ingredients.length === 0) return;
    
    // Show loading state
    loadingSpinner.style.display = 'flex';
    recipesContainer.innerHTML = '';
    resultsTitle.style.display = 'none';
    noResults.style.display = 'none';
    searchBtn.disabled = true;
    
    try {
        // Build ingredients string
        const ingredientList = ingredients.join(',+');
        const url = `${BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientList}&number=12&ranking=2`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        
        const recipes = await response.json();
        
        if (recipes.length === 0) {
            noResults.textContent = '😔 No recipes found with these ingredients. Try different ones!';
            noResults.style.display = 'block';
            loadingSpinner.style.display = 'none';
            searchBtn.disabled = false;
            recipeCount.textContent = '';
            return;
        }
        
        // Display results
        resultsTitle.style.display = 'block';
        displayRecipes(recipes);
        recipeCount.textContent = `Found ${recipes.length} delicious recipe${recipes.length !== 1 ? 's' : ''}!`;
        
    } catch (error) {
        console.error('Error:', error);
        recipesContainer.innerHTML = `
            <p class="empty-message" style="grid-column: 1/-1;">
                ⚠️ Error fetching recipes. Please check your API key and try again.
            </p>
        `;
        recipeCount.textContent = '';
    } finally {
        loadingSpinner.style.display = 'none';
        searchBtn.disabled = false;
    }
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = recipes.map(recipe => {
        const missingCount = recipe.missedIngredients?.length || 0;
        const usedCount = recipe.usedIngredients?.length || 0;
        const totalIngredients = usedCount + missingCount;
        const matchPercentage = Math.round((usedCount / totalIngredients) * 100);
        
        return `
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    
                    <div class="recipe-info">
                        <div class="info-badge">✓ Match: ${matchPercentage}%</div>
                        <div class="info-badge">📦 ${usedCount} ingredient${usedCount !== 1 ? 's' : ''} you have</div>
                    </div>
                    
                    <div class="ingredients-section">
                        <div class="ingredients-label">Ingredients Used:</div>
                        <div class="ingredients-list">
                            ${recipe.usedIngredients.map(ing => `
                                <span class="ingredient-item">${capitalizeFirst(ing.name)}</span>
                            `).join('')}
                        </div>
                        
                        ${missingCount > 0 ? `
                            <div class="ingredients-label" style="margin-top: 8px;">🛒 Missing:</div>
                            <div class="ingredients-list">
                                ${recipe.missedIngredients.map(ing => `
                                    <span class="ingredient-item missing">${capitalizeFirst(ing.name)}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <a href="https://www.spoonacular.com/recipes/${recipe.id}" target="_blank" class="recipe-link">
                        View Full Recipe →
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize
updateSearchButton();
ingredientInput.focus();
