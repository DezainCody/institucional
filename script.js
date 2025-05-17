// Script principal para a loja de roupas Closet Dellas
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true
    });
    
    // Inicializar Typed.js na hero section
    if (document.querySelector('.typed-element')) {
        let typed = new Typed('.typed-element', {
            strings: ['Sofisticação', 'Estilo Único', 'Autenticidade', 'Elegância'],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            startDelay: 500,
            loop: true
        });
    }
    
    // Inicializar animações Lottie
const lottieContainers = document.querySelectorAll('[data-lottie-container]');

const lottieUrls = {
    // Ícone de "Qualidade Premium"
    quality: 'https://assets7.lottiefiles.com/packages/lf20_8cxcnczq.json',
    
    // Ícone de "Design Exclusivo"
    design: 'https://assets10.lottiefiles.com/packages/lf20_1pxqjqps.json', // Designer de Moda Feminina
    
    // Ícone de "Moda Sustentável"
    sustain: 'https://assets1.lottiefiles.com/packages/lf20_tnrzlN.json',
    
    // Ícone de "Entrega Rápida"
    delivery: 'https://assets9.lottiefiles.com/packages/lf20_uu0x8lqv.json'
};
    
    // Verificar se a biblioteca lottie está disponível
    if (typeof lottie !== 'undefined') {
        console.log('Biblioteca Lottie carregada com sucesso!');
        
        // Inicializar cada animação Lottie
        lottieContainers.forEach(container => {
            const type = container.getAttribute('data-lottie-container');
            if (lottieUrls[type]) {
                try {
                    const anim = lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: lottieUrls[type]
                    });
                    
                    // Adicionar evento para detectar quando a animação é carregada
                    anim.addEventListener('DOMLoaded', function() {
                        console.log(`Animação ${type} carregada com sucesso!`);
                    });
                    
                    // Tratar erros de carregamento
                    anim.addEventListener('error', function() {
                        console.error(`Erro ao carregar a animação ${type}`);
                        // Fallback para ícones estáticos caso a animação falhe
                        container.innerHTML = getFallbackIcon(type);
                    });
                    
                } catch (error) {
                    console.error(`Erro ao inicializar a animação ${type}:`, error);
                    container.innerHTML = getFallbackIcon(type);
                }
            } else {
                console.warn(`URL não encontrada para o tipo de animação: ${type}`);
                container.innerHTML = getFallbackIcon(type);
            }
        });
    } else {
        console.warn('Biblioteca Lottie não encontrada. Usando ícones estáticos como fallback.');
        lottieContainers.forEach(container => {
            const type = container.getAttribute('data-lottie-container');
            container.innerHTML = getFallbackIcon(type);
        });
    }
    
    // Função para fornecer ícones fallback quando as animações Lottie falham
    function getFallbackIcon(type) {
        const icons = {
            quality: '<i class="fas fa-award" style="font-size: 2.5rem; color: var(--color-primary);"></i>',
            design: '<i class="fas fa-tshirt" style="font-size: 2.5rem; color: var(--color-primary);"></i>',
            sustain: '<i class="fas fa-leaf" style="font-size: 2.5rem; color: var(--color-primary);"></i>',
            delivery: '<i class="fas fa-shipping-fast" style="font-size: 2.5rem; color: var(--color-primary);"></i>'
        };
        
        return icons[type] || '<i class="fas fa-star" style="font-size: 2.5rem; color: var(--color-primary);"></i>';
    }
    
    // Efeito parallax para a hero section
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            let scrollPosition = window.pageYOffset;
            let speed = parseFloat(parallaxBg.getAttribute('data-parallax-speed') || 0.2);
            parallaxBg.style.transform = 'translateY(' + (scrollPosition * speed) + 'px)';
        });
    }
    
    // Ativar efeito de menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const nav = document.querySelector('.main-nav');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && menuClose) {
        menuToggle.addEventListener('click', () => {
            nav.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        menuClose.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);
    }

    function closeMenu() {
        nav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Carrinho de compras
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total strong');
    const cartClose = document.querySelector('.cart-close');
    const btnContinue = document.querySelector('.btn-continue');
    const btnCheckout = document.querySelector('.btn-checkout');

    // Flag para controlar se estamos adicionando a partir do botão plus no carrinho
    let addingFromCartPlus = false;
    let plusClickedItemIndex = -1;

    // Garantir que o carrinho comece corretamente fechado sem causar problemas de CSS
    function resetCartStyles() {
        cartSidebar.style.right = '-400px';
        cartSidebar.style.opacity = '0';
        cartSidebar.style.visibility = 'hidden';
        cartOverlay.style.opacity = '0';
        cartOverlay.style.visibility = 'hidden';
    }

    // Resetar o carrinho no carregamento da página
    resetCartStyles();

    // Sistema de pesquisa
    const searchIcon = document.querySelector('.search-icon');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');
    const searchResults = document.querySelector('.search-results');
    const limparPesquisa = document.getElementById('limpar-pesquisa');
    const produtosNaoEncontrados = document.querySelector('.produtos-nao-encontrados');

    // Barra de pesquisa principal
    const mainSearchInput = document.getElementById('main-search-input');
    const mainSearchClear = document.getElementById('main-search-clear');

    // Modal de Produto
    const productModal = document.querySelector('.product-modal');
    const productImage = document.querySelector('.product-image img');
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const closeModal = document.querySelector('.close-modal');
    const addToCartBtn = document.querySelector('.add-to-cart');
    const sizeBtns = document.querySelectorAll('.size-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    // Modal de Finalização de Pedido
    const checkoutModal = document.querySelector('.checkout-modal');
    const closeCheckout = document.querySelector('.close-checkout');
    const checkoutItems = document.querySelector('.checkout-items');
    const checkoutTotal = document.querySelector('.checkout-total strong');
    const checkoutForm = document.getElementById('checkout-form');

    // Variáveis para controle do produto atual
    let currentProduct = null;
    let selectedSize = null;

    // Scroll suave aprimorado para todos os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetElement = document.querySelector(this.getAttribute('href'));
            
            if (targetElement) {
                // Fechar o menu mobile se estiver aberto
                if (nav && nav.classList.contains('active')) {
                    closeMenu();
                }
                
                // Calcular a posição considerando o header fixo
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Animação de scroll suave com opções personalizadas
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Função para posicionar resultados de pesquisa
    function posicionarResultadosPesquisa() {
        if (!searchBar || !searchResults) return;
        
        // Obter a posição e dimensões da barra de pesquisa
        const searchBarRect = searchBar.getBoundingClientRect();
        
        // Posicionar resultados exatamente abaixo da barra de pesquisa
        searchResults.style.top = (searchBarRect.bottom + 5) + 'px';
        searchResults.style.left = searchBarRect.left + 'px';
        searchResults.style.width = searchBarRect.width + 'px';
    }

    // Função para abrir/fechar a barra de pesquisa
    function toggleSearchBar() {
        searchBar.classList.toggle('active');
        
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
            searchResults.classList.remove('active');
            searchResults.style.display = 'none';
            searchInput.value = '';
            
            setTimeout(() => {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                searchResults.style.top = '';
                searchResults.style.left = '';
                searchResults.style.width = '100%';
            }, 50);
        } else {
            closeSearchBar();
        }
    }

    // Função para fechar a barra de pesquisa
    function closeSearchBar() {
        searchBar.classList.remove('active');
        searchResults.classList.remove('active');
        searchResults.style.display = 'none';
        searchInput.value = '';
        
        // SOLUÇÃO: Quando a barra de pesquisa é fechada, restauramos a visibilidade de TODOS os produtos
        // na seção principal "Nossa Coleção" apenas
        const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
        produtosColecao.forEach(produto => {
            produto.classList.remove('produto-hidden');
        });
        
        if (produtosNaoEncontrados) {
            produtosNaoEncontrados.classList.remove('active');
            produtosNaoEncontrados.style.display = 'none';
        }
    }

    // Função para remover acentos para comparação
    function removerAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    // SOLUÇÃO: Função modificada para realizar a pesquisa somente em produtos específicos
    function realizarPesquisa(termoPesquisa, isMainSearch = false) {
        // Se o termo de pesquisa estiver vazio, reset tudo
        if (!termoPesquisa || termoPesquisa.trim() === '') {
            if (!isMainSearch) {
                searchResults.classList.remove('active');
                
                // Se for a pesquisa da lupa, restaurar todos os produtos da seção principal
                const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
                produtosColecao.forEach(produto => {
                    produto.classList.remove('produto-hidden');
                });
                
                if (produtosNaoEncontrados) {
                    produtosNaoEncontrados.classList.remove('active');
                    produtosNaoEncontrados.style.display = 'none';
                }
            } else {
                // Se for a pesquisa principal, restaurar apenas a pesquisa principal
                const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
                produtosColecao.forEach(produto => {
                    produto.classList.remove('produto-hidden');
                });
                
                if (produtosNaoEncontrados) {
                    produtosNaoEncontrados.classList.remove('active');
                    produtosNaoEncontrados.style.display = 'none';
                }
                
                if (mainSearchClear) {
                    mainSearchClear.classList.remove('active');
                }
            }
            return;
        }
        
        // Normalizar o termo de pesquisa
        termoPesquisa = removerAcentos(termoPesquisa.trim());
        
        if (isMainSearch) {
            // Para a barra de pesquisa principal, afetar apenas produtos da coleção principal
            filtrarProdutosColecao(termoPesquisa);
            
            if (mainSearchClear) {
                mainSearchClear.classList.add('active');
            }
        } else {
            // Para a barra de pesquisa da lupa, também afetar apenas produtos da coleção principal,
            // mas mostrar resultados de todos os produtos no dropdown
            
            // Obter todos os produtos para o dropdown de resultados
            const todosProdutos = document.querySelectorAll('.produto');
            
            // Filtrar para o dropdown
            const resultados = Array.from(todosProdutos).filter(produto => {
                const nomeProduto = removerAcentos(produto.dataset.nome);
                return nomeProduto.includes(termoPesquisa);
            });
            
            // Atualizar o dropdown de resultados
            atualizarResultadosPesquisa(resultados);
            
            // Filtrar apenas produtos da seção principal para exibição
            filtrarProdutosColecao(termoPesquisa);
        }
    }

    // SOLUÇÃO: Nova função para filtrar apenas produtos da coleção principal
    function filtrarProdutosColecao(termoPesquisa) {
        // Selecionar APENAS os produtos da seção principal "Nossa Coleção"
        const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
        
        let produtosVisiveis = 0;
        
        produtosColecao.forEach(produto => {
            const nomeProduto = removerAcentos(produto.dataset.nome);
            
            if (nomeProduto.includes(termoPesquisa)) {
                produto.classList.remove('produto-hidden');
                produtosVisiveis++;
            } else {
                produto.classList.add('produto-hidden');
            }
        });
        
        // Mostrar ou esconder a mensagem de "nenhum produto encontrado"
        if (produtosVisiveis === 0 && produtosNaoEncontrados) {
            produtosNaoEncontrados.classList.add('active');
            produtosNaoEncontrados.style.display = 'flex';
        } else if (produtosNaoEncontrados) {
            produtosNaoEncontrados.classList.remove('active');
            produtosNaoEncontrados.style.display = 'none';
        }
    }

    // Função para atualizar os resultados de pesquisa no dropdown
    function atualizarResultadosPesquisa(resultados) {
        searchResults.innerHTML = '';
        
        if (resultados.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results"><i class="fas fa-search"></i>Nenhum produto encontrado</div>';
        } else {
            resultados.forEach(produto => {
                const resultadoItem = document.createElement('div');
                resultadoItem.className = 'search-result-item';
                resultadoItem.innerHTML = `
                    <img src="${produto.dataset.img}" alt="${produto.dataset.nome}" class="search-result-img">
                    <div class="search-result-details">
                        <h4>${produto.dataset.nome}</h4>
                        <p>R$ ${parseFloat(produto.dataset.preco).toFixed(2).replace('.', ',')}</p>
                    </div>
                `;
                
                resultadoItem.addEventListener('click', () => {
                    const productData = {
                        id: produto.dataset.id,
                        name: produto.dataset.nome,
                        price: parseFloat(produto.dataset.preco),
                        image: produto.dataset.img
                    };
                    
                    openProductModal(productData);
                    
                    // Fechar a pesquisa
                    closeSearchBar();
                });
                
                searchResults.appendChild(resultadoItem);
            });
        }
        
        // Mostrar os resultados e posicioná-los corretamente
        searchResults.style.display = 'block';
        
        // Usar setTimeout para garantir que a renderização complete antes de animar
        setTimeout(() => {
            searchResults.classList.add('active');
        }, 10);
    }

    // Efeito de header scroll
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Reposicionar resultados da pesquisa ao fazer scroll
        if (searchResults.classList.contains('active')) {
            posicionarResultadosPesquisa();
        }
    });

    // Controle do slider de destaques
    const destaquesSlider = document.querySelector('.destaques-slider');
    const slideItems = document.querySelectorAll('.destaque-item');
    const prevBtn = document.querySelector('.slider-arrow-left');
    const nextBtn = document.querySelector('.slider-arrow-right');

    if (destaquesSlider && slideItems.length > 0) {
        // Recalcular após as alterações do tamanho dos itens
        const itemWidth = slideItems[0].offsetWidth;
        const slideGap = parseInt(window.getComputedStyle(destaquesSlider).columnGap) || 24;
        const moveDistance = itemWidth + slideGap;
        
        prevBtn.addEventListener('click', () => {
            destaquesSlider.scrollBy({
                left: -moveDistance,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            destaquesSlider.scrollBy({
                left: moveDistance,
                behavior: 'smooth'
            });
        });
    }

    // Tooltip para o botão de WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const tooltip = document.getElementById('tooltip');

    if (whatsappBtn && tooltip) {
        whatsappBtn.addEventListener('mouseenter', () => {
            const rect = whatsappBtn.getBoundingClientRect();
            tooltip.style.top = rect.top - 40 + 'px';
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.classList.add('visible');
        });
        
        whatsappBtn.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    }

    // Funções para o carrinho de compras
    function openCart() {
        // Primeiro, certifique-se de que os estilos sejam resetados para evitar conflitos
        cartSidebar.style.right = '-400px';
        cartSidebar.style.opacity = '0';
        cartSidebar.style.visibility = 'hidden';
        
        // Depois aplique as classes e estilos para abrir
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        
        // Aguarde um pequeno momento para aplicar a transição visual
        setTimeout(() => {
            cartSidebar.style.right = '0';
            cartSidebar.style.opacity = '1';
            cartSidebar.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    function closeCart() {
        cartSidebar.style.right = '-400px';
        cartSidebar.style.opacity = '0';
        cartSidebar.style.visibility = 'hidden';
        
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        
        document.body.style.overflow = '';
    }

    function updateCartDisplay() {
        // Atualiza apenas o contador de itens
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Atualiza a lista de itens no carrinho
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            cartTotal.textContent = 'R$ 0,00';
            return;
        }
        
        // Calcula o total
        let totalPrice = 0;
        
        // Adiciona cada item ao carrinho
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <p class="cart-item-size">Tamanho: ${item.size}</p>
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="10" data-index="${index}">
                        <button class="cart-quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <p class="cart-item-price-total">Total: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                    <button class="cart-item-remove" data-index="${index}">Remover</button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Atualiza o total do carrinho
        cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        
        // Adiciona event listeners para os botões de quantidade e remoção
        const minusBtns = document.querySelectorAll('.cart-item .minus');
        const plusBtns = document.querySelectorAll('.cart-item .plus');
        const quantityInputs = document.querySelectorAll('.cart-quantity-input');
        const removeBtns = document.querySelectorAll('.cart-item-remove');
        
        minusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCartDisplay();
                }
            });
        });
        
        // O botão plus agora abre a modal de produto
        plusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const item = cart[index];
                
                // Guardar o índice do item clicado
                plusClickedItemIndex = index;
                
                // Marcar que estamos adicionando a partir do botão plus
                addingFromCartPlus = true;
                
                // Obter os dados do produto para a modal
                const productData = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image
                };
                
                // Fechar o carrinho
                closeCart();
                
                // Abrir a modal do produto
                openProductModal(productData);
            });
        });
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', () => {
                const index = parseInt(input.dataset.index);
                const newQuantity = parseInt(input.value);
                
                if (newQuantity >= 1 && newQuantity <= 10) {
                    cart[index].quantity = newQuantity;
                } else if (newQuantity < 1) {
                    cart[index].quantity = 1;
                } else {
                    cart[index].quantity = 10;
                }
                
                updateCartDisplay();
            });
        });
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                cart.splice(index, 1);
                updateCartDisplay();
            });
        });
    }

    // Funções para o modal de produto
    function openProductModal(productData) {
        currentProduct = productData;
        
        // Preencher os dados do produto no modal
        productImage.src = productData.image;
        productTitle.textContent = productData.name;
        productPrice.textContent = `R$ ${productData.price.toFixed(2).replace('.', ',')}`;
        
        // Reset tamanho e quantidade
        selectedSize = null;
        sizeBtns.forEach(btn => btn.classList.remove('active'));
        quantityInput.value = 1;
        
        // Mostrar o modal
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Se estávamos adicionando a partir do carrinho e cancelamos, abrir o carrinho novamente
        if (addingFromCartPlus) {
            addingFromCartPlus = false;
            plusClickedItemIndex = -1;
            setTimeout(() => {
                openCart();
            }, 300);
        }
    }

    // Funções para o modal de checkout
    function openCheckoutModal() {
        // Mostrar os itens do carrinho no checkout
        updateCheckoutDisplay();
        
        // Mostrar o modal
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckoutModal() {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateCheckoutDisplay() {
        checkoutItems.innerHTML = '';
        
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            checkoutTotal.textContent = 'R$ 0,00';
            return;
        }
        
        // Calcula o total
        let totalPrice = 0;
        
        // Adiciona cada item ao checkout
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
                <div class="checkout-item-details">
                    <h4 class="checkout-item-title">${item.name}</h4>
                    <p>Quantidade: ${item.quantity} | Tamanho: ${item.size}</p>
                    <p>Preço: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                </div>
            `;
            
            checkoutItems.appendChild(checkoutItem);
        });
        
        // Atualiza o total do checkout
        checkoutTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    }

    // Função para adicionar ao carrinho
    function addToCart() {
        if (!currentProduct || !selectedSize) {
            alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
            return;
        }
        
        const quantity = parseInt(quantityInput.value);
        
        if (quantity < 1 || quantity > 10) {
            alert('A quantidade deve estar entre 1 e 10 itens.');
            return;
        }
        
        // Verifica se estamos adicionando a partir do botão "mais" no carrinho
        if (addingFromCartPlus && plusClickedItemIndex >= 0) {
            // Criar o novo item com os dados do produto atual
            const newItem = {
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                image: currentProduct.image,
                size: selectedSize,
                quantity: quantity
            };
            
            // Inserir o novo item logo após o item atual no carrinho
            cart.splice(plusClickedItemIndex + 1, 0, newItem);
            
            // Resetar as flags
            addingFromCartPlus = false;
            plusClickedItemIndex = -1;
        } else {
            // Comportamento original: adicionar como itens individuais
            for (let i = 0; i < quantity; i++) {
                // Adicionar novo item ao carrinho (1 unidade por vez)
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    image: currentProduct.image,
                    size: selectedSize,
                    quantity: 1  // Sempre adiciona 1 unidade
                });
            }
        }
        
        // Atualizar o carrinho e fechar o modal
        closeProductModal();
        
        // Pequeno delay para garantir que a modal feche completamente antes de abrir o carrinho
        setTimeout(() => {
            updateCartDisplay();
            openCart();
        }, 300);
    }

    // Event Listener para o formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            if (!nome || !telefone || !email || !mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Formatar a mensagem para o WhatsApp
            let whatsappMessage = `*Contato via Site - Closet Dellas*%0A%0A`;
            whatsappMessage += `*Nome:* ${nome}%0A`;
            whatsappMessage += `*Telefone:* ${telefone}%0A`;
            whatsappMessage += `*Email:* ${email}%0A%0A`;
            whatsappMessage += `*Mensagem:*%0A${mensagem}%0A%0A`;
            
            // Redirecionar para o WhatsApp usando o formato correto
            window.open(`https://wa.me/5583991816152?text=${whatsappMessage}`, '_blank');
            
            // Limpar o formulário
            contactForm.reset();
            
            // Mostrar confirmação
            alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
        });
    }

    // Event Listeners

    // Abrir/fechar carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeCart();
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            closeCart();
        });
    }

    if (btnContinue) {
        btnContinue.addEventListener('click', function() {
            closeCart();
        });
    }

    // Mostrar modal de produto ao clicar em "Comprar"
    const buyButtons = document.querySelectorAll('.btn-comprar');

    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productItem = button.closest('.produto');
            
            if (productItem) {
                const productData = {
                    id: productItem.dataset.id,
                    name: productItem.dataset.nome,
                    price: parseFloat(productItem.dataset.preco),
                    image: productItem.dataset.img
                };
                
                openProductModal(productData);
            }
        });
    });

    // Fechar modal de produto
    if (closeModal) {
        closeModal.addEventListener('click', closeProductModal);
    }

    // Selecionar tamanho no modal de produto
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
        });
    });

    // Controle de quantidade no modal de produto
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('change', () => {
            const newValue = parseInt(quantityInput.value);
            if (newValue < 1) {
                quantityInput.value = 1;
            } else if (newValue > 10) {
                quantityInput.value = 10;
            }
        });
    }

    // Adicionar ao carrinho do modal de produto
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    // Abrir modal de checkout
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }
            
            // Fechar carrinho
            closeCart();
            
            // Abrir checkout
            openCheckoutModal();
        });
    }

    // Fechar modal de checkout
    if (closeCheckout) {
        closeCheckout.addEventListener('click', closeCheckoutModal);
    }

    // Enviar pedido para WhatsApp
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
    
            // Validação rápida e centralizada
            const formFields = {
                nome: document.getElementById('checkout-nome'),
                telefone: document.getElementById('checkout-telefone'),
                endereco: document.getElementById('checkout-endereco'),
                pagamento: document.getElementById('checkout-pagamento')
            };
    
            // Verificação de campos vazios com feedback visual
            const validateFields = () => {
                let isValid = true;
                Object.entries(formFields).forEach(([key, field]) => {
                    if (!field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                    } else {
                        field.classList.remove('error');
                    }
                });
                return isValid;
            };
    
            // Verificações iniciais
            if (cart.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }
    
            if (!validateFields()) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
    
            // Preparar dados do pedido de forma mais eficiente
            const pedidoData = {
                cliente: {
                    nome: formFields.nome.value.trim(),
                    telefone: formFields.telefone.value.trim(),
                    endereco: formFields.endereco.value.trim(),
                    pagamento: formFields.pagamento.options[formFields.pagamento.selectedIndex].text
                },
                itens: cart.map(item => ({
                    nome: item.name,
                    quantidade: item.quantity,
                    tamanho: item.size,
                    valorTotal: (item.price * item.quantity).toFixed(2),
                    imagem: item.image // Adicionamos a imagem aos dados do pedido
                })),
                observacoes: document.getElementById('checkout-obs').value.trim(),
                totalPedido: cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
            };
    
            // Função para formatar mensagem incluindo links das imagens
            const formatWhatsAppMessage = (data) => {
                let message = `*Novo Pedido - Closet Dellas*%0A%0A`;
                
                // Dados do cliente
                message += `*Cliente:* ${data.cliente.nome}%0A`;
                message += `*Telefone:* ${data.cliente.telefone}%0A`;
                message += `*Endereço:* ${data.cliente.endereco}%0A`;
                message += `*Pagamento:* ${data.cliente.pagamento}%0A%0A`;
    
                // Itens do pedido com links para as imagens
                message += `*Itens do Pedido:*%0A`;
                data.itens.forEach(item => {
                    message += `- ${item.quantidade}x ${item.nome} (Tam: ${item.tamanho})%0A`;
                    message += `   R$ ${item.valorTotal.replace('.', ',')}%0A`;
                    message += `   Imagem: ${item.imagem}%0A%0A`; // Adicionamos a URL da imagem
                });
    
                // Total e observações
                message += `%0A*Total:* R$ ${data.totalPedido.replace('.', ',')}%0A`;
                
                if (data.observacoes) {
                    message += `%0A*Obs:* ${data.observacoes}%0A`;
                }
    
                return message;
            };
    
            // Link WhatsApp otimizado
            const whatsappLink = `https://wa.me/5583991816152?text=${formatWhatsAppMessage(pedidoData)}`;
            
            // Abrir WhatsApp em nova aba
            window.open(whatsappLink, '_blank');
    
            // Resetar estado
            cart = [];
            updateCartDisplay();
            closeCheckoutModal();
    
            // Confirmação suave
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Pedido Enviado!',
                    text: 'Entraremos em contato em breve.',
                    confirmButtonText: 'OK'
                });
            } else {
                alert('Pedido enviado com sucesso! Entraremos em contato em breve.');
            }
        });
    }

    // SOLUÇÃO: Event listeners para a funcionalidade de pesquisa da lupa no header
    if (searchIcon) {
        searchIcon.addEventListener('click', toggleSearchBar);
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            closeSearchBar();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            realizarPesquisa(this.value, false);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearchBar();
            }
        });
    }

    // Fechar resultados de pesquisa quando clicar fora
    document.addEventListener('click', (e) => {
        if (searchBar && searchIcon && searchBar.classList.contains('active') && 
            !searchBar.contains(e.target) && !searchIcon.contains(e.target) && !searchResults.contains(e.target)) {
            // Verificação adicional para não fechar ao clicar nos resultados
            closeSearchBar();
        }
    });

    // Event listeners para a pesquisa principal
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', function() {
            realizarPesquisa(this.value, true);
        });
        
        mainSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.value = '';
                // Resetar apenas produtos da coleção principal
                const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
                produtosColecao.forEach(produto => {
                    produto.classList.remove('produto-hidden');
                });
                
                if (produtosNaoEncontrados) {
                    produtosNaoEncontrados.classList.remove('active');
                    produtosNaoEncontrados.style.display = 'none';
                }
                
                if (mainSearchClear) {
                    mainSearchClear.classList.remove('active');
                }
            }
        });
    }

    // Botão para limpar a pesquisa principal
    if (mainSearchClear) {
        mainSearchClear.addEventListener('click', function() {
            mainSearchInput.value = '';
            
            // Resetar apenas produtos da coleção principal
            const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
            produtosColecao.forEach(produto => {
                produto.classList.remove('produto-hidden');
            });
            
            if (produtosNaoEncontrados) {
                produtosNaoEncontrados.classList.remove('active');
                produtosNaoEncontrados.style.display = 'none';
            }
            
            mainSearchClear.classList.remove('active');
        });
    }

    // Botão para limpar a pesquisa na mensagem de "nenhum produto encontrado"
    if (limparPesquisa) {
        limparPesquisa.addEventListener('click', () => {
            // Resetar apenas produtos da coleção principal
            const produtosColecao = document.querySelectorAll('.produtos-grid .produto');
            produtosColecao.forEach(produto => {
                produto.classList.remove('produto-hidden');
            });
            
            if (produtosNaoEncontrados) {
                produtosNaoEncontrados.classList.remove('active');
                produtosNaoEncontrados.style.display = 'none';
            }
            
            if (mainSearchInput) {
                mainSearchInput.value = '';
                if (mainSearchClear) {
                    mainSearchClear.classList.remove('active');
                }
            }
        });
    }

    // Impedir que o formulário de pesquisa envie
    if (searchBar) {
        searchBar.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // Adicionar evento de redimensionamento para atualizar a posição dos resultados
    window.addEventListener('resize', () => {
        if (searchResults.classList.contains('active')) {
            posicionarResultadosPesquisa();
        }
    });

    // Adicionar manipulador para fechamento de modal ao apertar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (productModal.classList.contains('active')) {
                closeProductModal();
            }
            if (cartSidebar.classList.contains('active')) {
                closeCart();
            }
            if (checkoutModal.classList.contains('active')) {
                closeCheckoutModal();
            }
        }
    });

    // Apenas atualiza o contador, sem mostrar o carrinho
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems || '0';
    }
});