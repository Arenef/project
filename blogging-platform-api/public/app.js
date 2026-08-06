const API_URL = '/api/blogs';

// DOM Elements
const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const newPostBtn = document.getElementById('newPostBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const loader = document.getElementById('loader');
const postModal = document.getElementById('postModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const postForm = document.getElementById('postForm');
const modalTitle = document.getElementById('modalTitle');
const toastContainer = document.getElementById('toastContainer');

// State
let posts = [];
let currentFilter = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query) {
                searchPosts(query);
            } else {
                fetchPosts();
            }
        }, 500);
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const tag = e.target.dataset.tag;

            if (tag) {
                filterByTag(tag);
            } else {
                fetchPosts();
            }
        });
    });

    // Modal
    newPostBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Form Submit
    postForm.addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) closeModal();
    });
}

// API Calls
async function fetchPosts() {
    showLoader();
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch posts');
        posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        showToast(error.message, 'error');
        renderEmptyState('Failed to load articles. Please try again later.');
    } finally {
        hideLoader();
    }
}

async function searchPosts(title) {
    showLoader();
    try {
        const response = await fetch(`${API_URL}/search?title=${encodeURIComponent(title)}`);
        if (!response.ok) {
            if (response.status === 404) {
                renderEmptyState('No articles found matching your search.');
                return;
            }
            throw new Error('Search failed');
        }
        const data = await response.json();
        renderPosts(Array.isArray(data) ? data : [data]);
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function filterByTag(tag) {
    showLoader();
    try {
        const response = await fetch(`${API_URL}/tags?tags=${encodeURIComponent(tag)}`);
        if (!response.ok) {
            if (response.status === 404) {
                renderEmptyState(`No articles found with tag: ${tag}`);
                return;
            }
            throw new Error('Filter failed');
        }
        const data = await response.json();
        renderPosts(Array.isArray(data) ? data : [data]);
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const tag = document.getElementById('postTags').value;

    const payload = { title, content, tag, category: 'General' };

    try {
        let response;
        if (id) {
            // Update
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to save post');
        }

        showToast(id ? 'Article updated successfully!' : 'Article published successfully!', 'success');
        closeModal();
        fetchPosts(); // Refresh list
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete post');

        showToast('Article deleted successfully!', 'success');
        fetchPosts(); // Refresh list
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// UI Functions
function renderPosts(postsToRender) {
    if (!postsToRender || postsToRender.length === 0) {
        renderEmptyState('No articles published yet. Be the first to share your story!');
        return;
    }

    postsContainer.innerHTML = '';

    // Sort posts by id descending (newest first, assuming id is sequential)
    const sortedPosts = [...postsToRender].sort((a, b) => b.id - a.id);

    sortedPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card glass-panel';

        // Generate a random gradient for the image placeholder based on id
        const hue1 = (post.id * 137.5) % 360;
        const hue2 = (hue1 + 45) % 360;

        // Parse tags
        let tagsHtml = '';
        if (post.tag) {
            const tagsList = post.tag.split(',').map(t => t.trim()).filter(t => t);
            tagsHtml = tagsList.map(t => `<span class="tag">${t}</span>`).join('');
        }

        // Format date if exists, else use current date
        const dateObj = post.created_at ? new Date(post.created_at) : new Date();
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        card.innerHTML = `
            <div class="post-image-container">
                <div class="post-image" style="background: linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))">
                    <i class="fa-solid fa-feather"></i>
                </div>
            </div>
            <div class="post-content">
                <div class="post-tags">${tagsHtml}</div>
                <h3 class="post-title">${escapeHTML(post.title)}</h3>
                <p class="post-excerpt">${escapeHTML(post.content)}</p>
                
                <div class="post-footer">
                    <span class="post-date"><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                    <div class="post-actions">
                        <button class="icon-btn edit" onclick="editPost(${post.id})" title="Edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="icon-btn delete" onclick="deletePost(${post.id})" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        postsContainer.appendChild(card);
    });
}

function renderEmptyState(message) {
    postsContainer.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-book-open"></i>
            <h3>No Articles Found</h3>
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">${message}</p>
        </div>
    `;
}

// Modal Functions
function openModal(post = null) {
    const isEdit = !!post;
    modalTitle.textContent = isEdit ? 'Edit Article' : 'Create New Article';

    document.getElementById('postId').value = isEdit ? post.id : '';
    document.getElementById('postTitle').value = isEdit ? post.title : '';
    document.getElementById('postContent').value = isEdit ? post.content : '';
    document.getElementById('postTags').value = isEdit && post.tag ? post.tag : '';

    postModal.classList.add('active');
}

function closeModal() {
    postModal.classList.remove('active');
    postForm.reset();
}

// Edit handler exposed globally for inline onclick
window.editPost = async (id) => {
    // Find post from local state
    let post = posts.find(p => p.id === id);

    if (!post) {
        // If not in state (e.g. after search), fetch it
        try {
            showLoader();
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch post details');
            post = await response.json();

            // If the API returns an array for single item, extract it
            if (Array.isArray(post)) post = post[0];

        } catch (error) {
            showToast(error.message, 'error');
            hideLoader();
            return;
        }
    }

    hideLoader();
    openModal(post);
};

window.deletePost = deletePost;

// Helpers
function showLoader() {
    loader.classList.add('active');
    postsContainer.style.display = 'none';
}

function hideLoader() {
    loader.classList.remove('active');
    postsContainer.style.display = 'grid';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
