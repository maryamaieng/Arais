// قاعدة بيانات مؤقتة
const appData = {
    halls: [
        {
            id: 1,
            name: "قاعة بغداد الدولية",
            description: "قاعة فاخرة بتصميم حديث في قلب بغداد.",
            price: 25000000,
            capacity: 500,
            city: "baghdad",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            owner: "أحمد العبيدي",
            features: ["سعة 500 شخص", "3 قاعات فرعية", "مواقف سيارات"]
        },
        {
            id: 2,
            name: "قاعة الرشيد",
            description: "قاعة كلاسيكية أنيقة في منطقة المنصور.",
            price: 18000000,
            capacity: 300,
            city: "baghdad",
            image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
            owner: "سعيد محمد",
            features: ["سعة 300 شخص", "ديكور تقليدي", "حديقة خارجية"]
        }
    ],
    
    services: [
        { id: 1, name: "كوشات وأركان", price: 2000000, icon: "fas fa-couch" },
        { id: 2, name: "خدمات الطعام", price: 5000000, icon: "fas fa-utensils" },
        { id: 3, name: "فرق موسيقية", price: 3000000, icon: "fas fa-music" },
        { id: 4, name: "التصوير", price: 2500000, icon: "fas fa-photo-video" }
    ],
    
    bookings: [
        { id: 1001, customer: "علي حسن", hall: "قاعة بغداد الدولية", date: "2024-03-15", amount: 32000000, status: "confirmed" }
    ]
};

// حالة التطبيق
let currentUser = null;
let currentRole = null;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // عناصر DOM
    const loginBtn = document.getElementById('loginBtn');
    const userTypes = document.querySelectorAll('.user-type');
    const hallForm = document.getElementById('hallForm');
    
    // تغيير نوع المستخدم
    userTypes.forEach(type => {
        type.addEventListener('click', function() {
            userTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // تسجيل الدخول
    loginBtn.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const activeType = document.querySelector('.user-type.active').dataset.type;
        
        if (!username) {
            alert('يرجى إدخال اسم المستخدم');
            return;
        }
        
        currentUser = username;
        currentRole = activeType;
        
        // إخفاء شاشة الدخول
        document.getElementById('loginScreen').style.display = 'none';
        
        // تحميل الواجهة المناسبة
        loadDashboard(activeType);
    });
    
    // نموذج إضافة قاعة
    if (hallForm) {
        hallForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewHall();
            document.getElementById('addHallModal').style.display = 'none';
        });
    }
    
    // إغلاق نافذة إضافة قاعة
    document.getElementById('closeHallModal')?.addEventListener('click', function() {
        document.getElementById('addHallModal').style.display = 'none';
    });
    
    document.getElementById('cancelHallBtn')?.addEventListener('click', function() {
        document.getElementById('addHallModal').style.display = 'none';
    });
}

function loadDashboard(role) {
    const container = document.getElementById('appContainer');
    
    switch(role) {
        case 'admin':
            container.innerHTML = getAdminDashboard();
            setupAdminEvents();
            break;
        case 'owner':
            container.innerHTML = getOwnerDashboard();
            setupOwnerEvents();
            break;
        case 'customer':
            container.innerHTML = getCustomerDashboard();
            setupCustomerEvents();
            break;
    }
}

// واجهة المدير
function getAdminDashboard() {
    return `
        <div class="dashboard">
            <div class="sidebar">
                <div class="logo">
                    <h1>JoyIQ</h1>
                    <p>مدير النظام</p>
                </div>
                <ul class="menu">
                    <li class="menu-item"><a href="#" class="menu-link active"><i class="fas fa-home"></i><span>الرئيسية</span></a></li>
                    <li class="menu-item"><a href="#" class="menu-link"><i class="fas fa-building"></i><span>إدارة القاعات</span></a></li>
                    <li class="menu-item"><a href="#" class="menu-link"><i class="fas fa-users"></i><span>أصحاب القاعات</span></a></li>
                    <li class="menu-item"><a href="#" class="menu-link"><i class="fas fa-calendar-alt"></i><span>الحجوزات</span></a></li>
                    <li class="menu-item"><a href="#" id="logoutBtn" class="menu-link"><i class="fas fa-sign-out-alt"></i><span>تسجيل الخروج</span></a></li>
                </ul>
            </div>
            
            <div class="main-content">
                <div class="top-bar">
                    <div></div>
                    <div class="user-info">
                        <div>
                            <h4>${currentUser}</h4>
                            <p>مدير النظام</p>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=${currentUser}&background=8B4513&color=fff" alt="صورة المدير">
                    </div>
                </div>
                
                <div class="content">
                    <div class="dashboard-cards">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">إجمالي القاعات</h3>
                                <div class="card-icon halls"><i class="fas fa-building"></i></div>
                            </div>
                            <div class="card-value">${appData.halls.length}</div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">إجمالي الإيرادات</h3>
                                <div class="card-icon revenue"><i class="fas fa-dollar-sign"></i></div>
                            </div>
                            <div class="card-value">${appData.bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()} د.ع</div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">الحجوزات النشطة</h3>
                                <div class="card-icon booking"><i class="fas fa-calendar-check"></i></div>
                            </div>
                            <div class="card-value">${appData.bookings.filter(b => b.status === 'confirmed').length}</div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-header">
                            <h2 class="section-title">أحدث القاعات</h2>
                            <button class="btn btn-secondary" id="adminAddHallBtn">
                                <i class="fas fa-plus"></i> إضافة قاعة
                            </button>
                        </div>
                        <div class="halls-grid" id="adminHallsGrid"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// واجهة صاحب القاعة
function getOwnerDashboard() {
    return `
        <div class="dashboard">
            <div class="sidebar">
                <div class="logo">
                    <h1>JoyIQ</h1>
                    <p>صاحب القاعة</p>
                </div>
                <ul class="menu">
                    <li class="menu-item"><a href="#" class="menu-link active"><i class="fas fa-home"></i><span>الرئيسية</span></a></li>
                    <li class="menu-item"><a href="#" class="menu-link"><i class="fas fa-building"></i><span>قاعاتي</span></a></li>
                    <li class="menu-item"><a href="#" class="menu-link"><i class="fas fa-calendar-alt"></i><span>حجوزاتي</span></a></li>
                    <li class="menu-item"><a href="#" id="ownerLogoutBtn" class="menu-link"><i class="fas fa-sign-out-alt"></i><span>تسجيل الخروج</span></a></li>
                </ul>
            </div>
            
            <div class="main-content">
                <div class="top-bar">
                    <div></div>
                    <div class="user-info">
                        <div>
                            <h4>${currentUser}</h4>
                            <p>صاحب قاعة</p>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=${currentUser}&background=8B4513&color=fff" alt="صورة المالك">
                    </div>
                </div>
                
                <div class="content">
                    <div class="dashboard-cards">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">قاعاتي</h3>
                                <div class="card-icon halls"><i class="fas fa-building"></i></div>
                            </div>
                            <div class="card-value">${appData.halls.filter(h => h.owner === currentUser).length}</div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">إيرادات الشهر</h3>
                                <div class="card-icon revenue"><i class="fas fa-dollar-sign"></i></div>
                            </div>
                            <div class="card-value">45,000,000 د.ع</div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">الحجوزات النشطة</h3>
                                <div class="card-icon booking"><i class="fas fa-calendar-check"></i></div>
                            </div>
                            <div class="card-value">8</div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-header">
                            <h2 class="section-title">قاعاتي</h2>
                            <button class="btn btn-secondary" id="ownerAddHallBtn">
                                <i class="fas fa-plus"></i> إضافة قاعة جديدة
                            </button>
                        </div>
                        <div class="halls-grid" id="ownerHallsGrid"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// واجهة العميل
function getCustomerDashboard() {
    return `
        <div class="content">
            <div class="customer-view">
                <div class="customer-header">
                    <h1 class="customer-title">عراق الأفراح - JoyIQ</h1>
                    <p class="customer-subtitle">احجز قاعة أحلامك لأهم يوم في حياتك</p>
                    <button class="btn btn-secondary" id="customerLogoutBtn" style="width: auto; margin-top: 10px;">
                        <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                    </button>
                </div>
                
                <div class="search-filters">
                    <div class="form-group">
                        <label>تاريخ المناسبة</label>
                        <input type="date" class="form-control" id="eventDate">
                    </div>
                    <div class="form-group">
                        <label>المحافظة</label>
                        <select class="form-control" id="city">
                            <option value="baghdad">بغداد</option>
                            <option value="basra">البصرة</option>
                        </select>
                    </div>
                    <button class="btn" id="searchHallsBtn">بحث عن قاعات</button>
                </div>
                
                <h2 style="margin: 25px 0 15px; color: var(--primary);">اختر الخدمات الإضافية</h2>
                <div class="services-grid" id="servicesGrid"></div>
                
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">القاعات المتاحة</h2>
                    </div>
                    <div class="halls-grid" id="customerHallsGrid"></div>
                </div>
                
                <div class="booking-summary" id="bookingSummary" style="display: none;">
                    <h3 style="margin-bottom: 20px; color: var(--primary);">ملخص الحجز</h3>
                    <div id="summaryItems"></div>
                    <div class="summary-total" id="totalAmount">
                        <span>المجموع الكلي</span>
                        <span>0 د.ع</span>
                    </div>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 20px;" id="confirmBookingBtn">تأكيد الحجز</button>
                </div>
            </div>
        </div>
    `;
}

// دوال مساعدة
function setupAdminEvents() {
    document.getElementById('adminAddHallBtn')?.addEventListener('click', function() {
        document.getElementById('addHallModal').style.display = 'flex';
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // تحميل قاعات المدير
    loadAdminHalls();
}

function setupOwnerEvents() {
    document.getElementById('ownerAddHallBtn')?.addEventListener('click', function() {
        document.getElementById('addHallModal').style.display = 'flex';
    });
    
    document.getElementById('ownerLogoutBtn')?.addEventListener('click', logout);
    
    // تحميل قاعات المالك
    loadOwnerHalls();
}

function setupCustomerEvents() {
    document.getElementById('searchHallsBtn')?.addEventListener('click', loadCustomerHalls);
    document.getElementById('customerLogoutBtn')?.addEventListener('click', logout);
    
    // تحميل الخدمات
    loadServices();
    // تحميل القاعات
    loadCustomerHalls();
}

function loadAdminHalls() {
    const container = document.getElementById('adminHallsGrid');
    if (!container) return;
    
    container.innerHTML = appData.halls.map(hall => `
        <div class="hall-card">
            <div class="hall-image" style="background-image: url('${hall.image}')"></div>
            <div class="hall-content">
                <h3 class="hall-title">${hall.name}</h3>
                <div class="hall-price">${hall.price.toLocaleString()} د.ع</div>
                <p>${hall.description}</p>
                <div class="hall-features">
                    ${hall.features.map(f => <span class="feature">${f}</span>).join('')}
                </div>
                <div class="hall-actions">
                    <button class="btn">تفاصيل</button>
                    <button class="btn btn-secondary">تعديل</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadOwnerHalls() {
    const container = document.getElementById('ownerHallsGrid');
    if (!container) return;
    
    const ownerHalls = appData.halls.filter(hall => hall.owner === currentUser);
    
    container.innerHTML = ownerHalls.map(hall => `
        <div class="hall-card">
            <div class="hall-image" style="background-image: url('${hall.image}')"></div>
            <div class="hall-content">
                <h3 class="hall-title">${hall.name}</h3>
                <div class="hall-price">${hall.price.toLocaleString()} د.ع</div>
                <p>${hall.description}</p>
                <div class="hall-features">
                    ${hall.features.map(f => <span class="feature">${f}</span>).join('')}
                </div>
                <div class="hall-actions">
                    <button class="btn">تفاصيل</button>
                    <button class="btn btn-danger">حذف</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadCustomerHalls() {
    const container = document.getElementById('customerHallsGrid');
    if (!container) return;
    
    container.innerHTML = appData.halls.map(hall => `
        <div class="hall-card">
            <div class="hall-image" style="background-image: url('${hall.image}')"></div>
            <div class="hall-content">
                <h3 class="hall-title">${hall.name}</h3>
                <div class="hall-price">${hall.price.toLocaleString()} د.ع</div>
                <p>${hall.description}</p>
                <div class="hall-features">
                    ${hall.features.map(f => <span class="feature">${f}</span>).join('')}
                </div>
                <button class="btn book-hall-btn" data-hall-id="${hall.id}" style="width: 100%; margin-top: 10px;">
                    احجز الآن
                </button>
            </div>
        </div>
    `).join('');
    
    // إضافة أحداث للحجز
    document.querySelectorAll('.book-hall-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const hallId = this.dataset.hallId;
            const hall = appData.halls.find(h => h.id == hallId);
            if (hall) {
                alert(تم اختيار قاعة: ${hall.name}\nالسعر: ${hall.price.toLocaleString()} د.ع\nسيتم التواصل معك قريباً.);
            }
        });
    });
}

function loadServices() {
    const container = document.getElementById('servicesGrid');
    if (!container) return;
    
    container.innerHTML = appData.services.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-icon"><i class="${service.icon}"></i></div>
            <h3>${service.name}</h3>
            <div class="hall-price">${service.price.toLocaleString()} د.ع</div>
        </div>
    `).join('');
}

function addNewHall() {
    const name = document.getElementById('hallName').value;
    const price = document.getElementById('hallPrice').value;
    
    if (!name || !price) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const newHall = {
        id: appData.halls.length + 1,
        name: name,
        description: "قاعة جديدة",
        price: parseInt(price),
        capacity: 200,
        city: "baghdad",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
        owner: currentRole === 'owner' ? currentUser : "أحمد العبيدي",
        features: ["سعة 200 شخص", "ديكور حديث"]
    };
    
    appData.halls.push(newHall);
    
    // إعادة تحميل الواجهة
    if (currentRole === 'admin') {
        loadAdminHalls();
    } else if (currentRole === 'owner') {
        loadOwnerHalls();
    }
    
    alert('تم إضافة القاعة بنجاح!');
    
    // إعادة تعيين النموذج
    document.getElementById('hallForm').reset();
}

function logout() {
    // إعادة تعيين التطبيق
    currentUser = null;
    currentRole = null;
    
    // إخفاء جميع الواجهات
    document.getElementById('appContainer').innerHTML = '';
    document.getElementById('addHallModal').style.display = 'none';
    
    // إظهار شاشة الدخول
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// محاكاة الاتصال بـ AWS
function connectToAWS() {
    console.log('🔄 جاري الاتصال بخدمات AWS...');
    
    // هنا يمكنك إضافة كود الاتصال الحقيقي بـ AWS
    // مثل: AWS.config.update({region: 'us-east-1'});
    
    setTimeout(() => {
        console.log('✅ تم الاتصال بـ AWS بنجاح');
        document.querySelector('.aws-info').innerHTML = `
            <p><i class="fas fa-cloud"></i> متصل بـ AWS</p>
            <small>الحالة: نشط ✓</small>
        `;
    }, 1000);
}

// بدء الاتصال بـ AWS عند تحميل الصفحة
window.onload = connectToAWS;
