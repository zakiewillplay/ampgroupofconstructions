// ===== Preloader =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 800);
  }
});

// ===== Dynamic Calendar Tracking =====
document.addEventListener('DOMContentLoaded', () => {
  const yearContainer = document.getElementById('runtime-year');
  if (yearContainer) {
    yearContainer.textContent = new Date().getFullYear();
  }
});

// ===== Mobile Navigation =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('active');
  });
});

// ===== Resilient Active Nav Link Highlighting =====
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (
    currentPath.endsWith(href) || 
    (href === 'indexAmp.html' && (currentPath === '/' || currentPath === ''))
  ) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ===== GSAP Animations =====
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  if (document.querySelector('.hero')) {
    const heroTl = gsap.timeline({ delay: 0.8 });
    
    // BUG FIX: Removed the "nav" animation so the header stops disappearing on mobile
    heroTl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" })
          .from(".hero h1", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
          .from(".tagline", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.6")
          .from(".hero-trust-bar", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
          .from(".hero-cta a", { y: 20, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }, "-=0.6");
  }

  gsap.utils.toArray('.reveal').forEach(section => {
    gsap.fromTo(section, 
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

// ===== 3D Tilt for Service Cards =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// ===== Particle Animation (Home Page Only) =====
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
  const ctx = particleCanvas.getContext('2d');
  let particles = [];
  
  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * particleCanvas.width;
      this.y = Math.random() * particleCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.6 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > particleCanvas.width || this.y < 0 || this.y > particleCanvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
      ctx.fill();
      
      particles.forEach(p => {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(201, 168, 76, ${0.08 * (1 - dist/120)})`;
          ctx.stroke();
        }
      });
    }
  }
  
  for (let i = 0; i < 60; i++) { particles.push(new Particle()); }
  function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ===== Portfolio Filter Engine =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== Lightbox Logic with Validation =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) {
      window.location.href = 'portfolioAmp.html';
      return; 
    }
    const img = item.querySelector('img');
    const caption = item.querySelector('.portfolio-overlay h4')?.textContent || '';
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Portfolio Work View';
    }
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightboxContainer = () => {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
};

if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxContainer);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightboxContainer();
  });
}

// ===== Contact Form Handler =====
const contactForm = document.getElementById('whatsappForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName')?.value || '';
    const phone = document.getElementById('formPhone')?.value || '';
    const service = document.getElementById('formService')?.value || '';
    const message = document.getElementById('formMessage')?.value || '';
    
    const whatsappMessage = encodeURIComponent(
      `*New Enquiry for AMP Group of Constructions*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Service Interested:* ${service}\n` +
      `*Message:* ${message}\n\n` +
      `-- Sent via AMP Website`
    );
    
    window.open(`https://wa.me/917889321153?text=${whatsappMessage}`, '_blank');
    contactForm.reset();
  });
}

// ===== XSS Protected Chatbot Logic =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

const chatbotResponses = {
  hi: "Hello! 👋 Welcome to AMP Group of Constructions. How can I help you today? You can ask about our services, contact details, projects, or schedule a consultation.",
  hello: "Hi there! 👋 Welcome to AMP Group. How can I assist you today?",
  services: "We offer complete Design-to-Execution solutions:\n\n🏗️ *Construction* - Structural & Architectural\n🏠 *Interiors* - Luxury Residential & Commercial\n🏢 *Real Estate* - Property solutions\n\nWhich service would you like to know more about?",
  contact: "📍 *Address:* 90 Feet Road, near Kashmir Trout Restaurant, Soura, Srinagar – 190011\n📞 *Phone/WhatsApp:* +91 78893 21153\n📧 *Email:* ampgroupofconstructions@gmail.com",
  email: "You can reach us at: *ampgroupofconstructions@gmail.com*",
  address: "We're located at: *90 Feet Road, near Kashmir Trout Restaurant, Soura, Srinagar – 190011*",
  founder: "AMP Group of Constructions was founded by *Aabid Mushtaq*, a visionary leader dedicated to transforming the construction landscape in Kashmir with premium quality and innovative designs.",
  projects: "We've completed 9 prestigious projects including:\n\n🏡 6 Exterior Residential projects\n🏠 2 Luxury Interior projects\n🏥 1 Commercial project (Al Aflaj Polyclinic)\n\nType 'portfolio' to see more details!",
  portfolio: "Our portfolio includes:\n\n*Exteriors:* Modern Facade, Brick & Wood, Grey Gable, Ornate Villa, Yellow Trim House, Dark Textured Modern\n*Interiors:* Luxury Residence Interiors, Custom Wardrobes & Vanity\n*Commercial:* Al Aflaj Polyclinic & Diagnostic Centre",
  testimonial: "Dr. Altaf Hussain from Al Aflaj Polyclinic says: \"We recently carried out renovation work on our clinic with AMP Group... it was really a pleasure. They carry out work with great ease and convenience. I would definitely recommend taking advantage of their solutions.\"",
  consultation: "Great! To schedule a consultation, simply fill out the contact form on our Contact page or WhatsApp us directly at +91 78893 21153. We'll get back to you within 24 hours!",
  default: "I'm here to help! You can ask me about:\n\n• Our *services*\n• *Contact* details\n• *Founder* information\n• Completed *projects*\n• Client *testimonials*\n• Schedule a *consultation*\n\nJust type a keyword or your question!"
};

// Perfectly clean HTML character escape mapping 
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    "'": '&#39;', 
    '"': '&quot;'
  }[tag] || tag));
}

function getBotResponse(userInput) {
  const input = userInput.toLowerCase().trim();
  if (input.includes('hi') || input.includes('hello') || input.includes('hey')) return chatbotResponses.hi;
  if (input.includes('service') || input.includes('what do you do')) return chatbotResponses.services;
  if (input.includes('contact') || input.includes('phone') || input.includes('number') || input.includes('reach')) return chatbotResponses.contact;
  if (input.includes('email')) return chatbotResponses.email;
  if (input.includes('address') || input.includes('location') || input.includes('where')) return chatbotResponses.address;
  if (input.includes('founder') || input.includes('owner') || input.includes('aabid')) return chatbotResponses.founder;
  if (input.includes('project') || input.includes('work')) return chatbotResponses.projects;
  if (input.includes('portfolio') || input.includes('gallery')) return chatbotResponses.portfolio;
  if (input.includes('testimonial') || input.includes('review')) return chatbotResponses.testimonial;
  if (input.includes('consult') || input.includes('appointment')) return chatbotResponses.consultation;
  return chatbotResponses.default;
}

function addChatMessage(text, type) {
  if (!chatbotMessages) return;
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chatbot-message', type);
  
  let structuralText = type === 'user' ? escapeHTML(text) : text;
  msgDiv.innerHTML = structuralText.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function handleChatbotSend() {
  if (!chatbotInput) return;
  const userInput = chatbotInput.value.trim();
  if (!userInput) return;
  
  addChatMessage(userInput, 'user');
  chatbotInput.value = '';
  
  setTimeout(() => {
    const response = getBotResponse(userInput);
    addChatMessage(response, 'bot');
  }, 450);
}

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener('click', () => {
    chatbotPanel.classList.toggle('open');
    if (chatbotPanel.classList.contains('open') && chatbotMessages?.children.length === 0) {
      addChatMessage("Hello! 👋 I'm the AMP Group assistant. How can I help you today?", 'bot');
    }
  });
}

if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener('click', () => chatbotPanel.classList.remove('open'));
}
if (chatbotSend) chatbotSend.addEventListener('click', handleChatbotSend);
if (chatbotInput) {
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatbotSend();
  });
}

// ===== Image Fallback Optimization =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const wrapper = img.parentElement;
    if (wrapper) {
      wrapper.style.minHeight = '200px';
      wrapper.style.background = 'rgba(201, 168, 76, 0.05)';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      
      if (!wrapper.querySelector('.fallback-icon')) {
        const fallback = document.createElement('span');
        fallback.className = 'fallback-icon';
        fallback.textContent = '🏗️';
        fallback.style.fontSize = '3rem';
        wrapper.appendChild(fallback);
      }
    }
  });
});
