// Script principal para a loja de roupas Estilo Único
document.addEventListener('DOMContentLoaded', function() {
    // Ativar efeito de menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const nav = document.querySelector('nav');
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

    // SOLUÇÃO PROBLEMA 1: Função aprimorada para posicionar resultados de pesquisa
    function posicionarResultadosPesquisa() {
        if (!searchBar || !searchResults) return;
        
        // Obter a posição e dimensões da barra de pesquisa
        const searchBarRect = searchBar.getBoundingClientRect();
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Posicionar resultados exatamente abaixo da barra de pesquisa
        searchResults.style.top = (searchBarRect.bottom + 5) + 'px';
        searchResults.style.left = searchBarRect.left + 'px';
        searchResults.style.width = searchBarRect.width + 'px';
    }

    // Função para abrir/fechar a barra de pesquisa com posicionamento consistente
    function toggleSearchBar() {
        searchBar.classList.toggle('active');
        
        if (searchBar.classList.contains('active')) {
            // Quando abre a barra, posiciona-a corretamente
            searchInput.focus();
            
            // Fechar resultados ao abrir para depois mostrar apenas com a pesquisa
            searchResults.classList.remove('active');
            searchResults.style.display = 'none';
            
            // Limpar o input para garantir que não mostrem resultados antigos
            searchInput.value = '';
            
            // Adicionar pequeno atraso para permitir que a barra de pesquisa seja renderizada primeiro
            setTimeout(() => {
                // Garantir que a barra esteja visível na tela
                const headerHeight = document.querySelector('header').offsetHeight;
                searchBar.style.top = (headerHeight + 5) + 'px';
                
                // Pré-posicionar os resultados (mesmo que não mostrados ainda)
                posicionarResultadosPesquisa();
            }, 50);
        } else {
            // Quando fecha a barra, limpa tudo
            closeSearchBar();
        }
    }

    // Função para fechar a barra de pesquisa (para ser usada em vários lugares)
    function closeSearchBar() {
        searchBar.classList.remove('active');
        searchResults.classList.remove('active');
        searchResults.style.display = 'none';
        searchInput.value = '';
    }

    // Função para remover acentos para comparação
    function removerAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    // Função melhorada para realizar a pesquisa
    function realizarPesquisa(termoPesquisa, isMainSearch = false) {
        // Se o termo de pesquisa estiver vazio, reset tudo
        if (!termoPesquisa || termoPesquisa.trim() === '') {
            if (!isMainSearch) {
                searchResults.classList.remove('active');
            }
            resetarFiltros();
            return;
        }
        
        termoPesquisa = removerAcentos(termoPesquisa.trim());
        
        // Recuperar os produtos - todos ou apenas da seção de destaques
        let todosProdutos;
        if (isMainSearch) {
            // Se for pesquisa principal, buscar apenas os produtos na seção de destaques
            todosProdutos = document.querySelectorAll('.destaques-slider .produto');
        } else {
            // Caso contrário, buscar todos os produtos da página
            todosProdutos = document.querySelectorAll('.produto');
        }
        
        // Filtrar os resultados - agora usando includes() para correspondências parciais
        const resultados = Array.from(todosProdutos).filter(produto => {
            const nomeProduto = removerAcentos(produto.dataset.nome);
            return nomeProduto.includes(termoPesquisa);
        });
        
        // Se não for a pesquisa principal, atualizar o dropdown de resultados
        if (!isMainSearch) {
            atualizarResultadosPesquisa(resultados);
        }
        
        // Filtrar os produtos na página principal ou na seção de destaques
        filtrarProdutos(termoPesquisa, isMainSearch);
        
        // Atualizar o botão de limpar da pesquisa principal
        if (isMainSearch && mainSearchClear) {
            mainSearchClear.classList.add('active');
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
            posicionarResultadosPesquisa();
            searchResults.classList.add('active');
        }, 10);
    }

    // Função melhorada para filtrar os produtos na página principal
    function filtrarProdutos(termoPesquisa, isMainSearch = false) {
        let todosProdutos;
        let produtosNaoEncontradosElement;
        
        if (isMainSearch) {
            // Se for pesquisa principal, buscar apenas os produtos na seção de destaques
            todosProdutos = document.querySelectorAll('.destaques-slider .produto');
            // Criar ou obter uma mensagem de "não encontrado" específica para a seção de destaques
            produtosNaoEncontradosElement = document.querySelector('.destaques .produtos-nao-encontrados');
            if (!produtosNaoEncontradosElement) {
                produtosNaoEncontradosElement = document.createElement('div');
                produtosNaoEncontradosElement.className = 'produtos-nao-encontrados';
                produtosNaoEncontradosElement.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>Nenhum produto encontrado para sua pesquisa.</p>
                    <button class="btn limpar-pesquisa-destaque">Limpar Pesquisa</button>
                `;
                document.querySelector('.destaques-container').appendChild(produtosNaoEncontradosElement);
                
                // Adicionar evento para o botão limpar
                const limparPesquisaDestaque = document.querySelector('.limpar-pesquisa-destaque');
                if (limparPesquisaDestaque) {
                    limparPesquisaDestaque.addEventListener('click', () => {
                        if (mainSearchInput) {
                            mainSearchInput.value = '';
                            resetarFiltros(true);
                        }
                    });
                }
            }
        } else {
            // Caso contrário, buscar todos os produtos da página
            todosProdutos = document.querySelectorAll('.produto');
            produtosNaoEncontradosElement = produtosNaoEncontrados;
        }
        
        let produtosVisiveis = 0;
        
        todosProdutos.forEach(produto => {
            const nomeProduto = removerAcentos(produto.dataset.nome);
            
            // Verifica se o nome do produto contém o termo de pesquisa (correspondência parcial)
            if (nomeProduto.includes(termoPesquisa)) {
                produto.classList.remove('produto-hidden');
                produtosVisiveis++;
            } else {
                produto.classList.add('produto-hidden');
            }
        });
        
        // Mostrar mensagem se nenhum produto for encontrado
        if (produtosVisiveis === 0 && produtosNaoEncontradosElement) {
            produtosNaoEncontradosElement.style.display = 'block';
        } else if (produtosNaoEncontradosElement) {
            produtosNaoEncontradosElement.style.display = 'none';
        }
    }

    // Função para resetar filtros de pesquisa
    function resetarFiltros(onlyMainSearch = false) {
        if (onlyMainSearch) {
            // Resetar apenas a pesquisa principal
            const destaqueProdutos = document.querySelectorAll('.destaques-slider .produto');
            destaqueProdutos.forEach(produto => {
                produto.classList.remove('produto-hidden');
            });
            
            const destaquesNaoEncontrados = document.querySelector('.destaques .produtos-nao-encontrados');
            if (destaquesNaoEncontrados) {
                destaquesNaoEncontrados.style.display = 'none';
            }
            
            if (mainSearchInput) {
                mainSearchInput.value = '';
                if (mainSearchClear) {
                    mainSearchClear.classList.remove('active');
                }
            }
        } else {
            // Resetar todas as pesquisas
            const todosProdutos = document.querySelectorAll('.produto');
            
            todosProdutos.forEach(produto => {
                produto.classList.remove('produto-hidden');
            });
            
            produtosNaoEncontrados.style.display = 'none';
            searchInput.value = '';
            searchBar.classList.remove('active');
            searchResults.classList.remove('active');
            
            const destaquesNaoEncontrados = document.querySelector('.destaques .produtos-nao-encontrados');
            if (destaquesNaoEncontrados) {
                destaquesNaoEncontrados.style.display = 'none';
            }
            
            if (mainSearchInput) {
                mainSearchInput.value = '';
                if (mainSearchClear) {
                    mainSearchClear.classList.remove('active');
                }
            }
        }
    }

    // Efeito de header scroll
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Reposicionar resultados da pesquisa ao fazer scroll
        if (searchResults.classList.contains('active')) {
            posicionarResultadosPesquisa();
        }
    });

    // Navegação suave ao clicar em links do menu
    const navLinks = document.querySelectorAll('nav a, .footer-links a, .btn[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    closeMenu();
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Inicializar animações de scroll
    function initScrollAnimations() {
        // Seleciona todos os itens que devem ter animação ao scroll
        const animatedElements = [
            ...document.querySelectorAll('.colecao-item'),
            ...document.querySelectorAll('.destaque-item'),
            ...document.querySelectorAll('.sobre-text'),
            ...document.querySelectorAll('.contato-content > div')
        ];
        
        // Adiciona classe inicial para esconder os elementos
        animatedElements.forEach(element => {
            element.classList.add('scroll-animation');
        });
        
        // Função para verificar se um elemento está visível na viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
        }
        
        // Função para animar elementos visíveis
        function animateElementsOnScroll() {
            animatedElements.forEach((element, index) => {
                if (isElementInViewport(element) && !element.classList.contains('animated')) {
                    // Calculando um delay escalonado
                    const row = Math.floor(index / 3); // Assume 3 elementos por linha
                    const col = index % 3;
                    const delay = 0.1 + (row * 0.15) + (col * 0.1);
                    
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, delay * 1000);
                }
            });
        }
        
        // Verificar elementos visíveis no carregamento inicial
        setTimeout(() => {
            animateElementsOnScroll();
        }, 200);
        
        // Adicionar listener de scroll para animar elementos quando se tornarem visíveis
        window.addEventListener('scroll', animateElementsOnScroll, { passive: true });
    }

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

    // Funções para o carrinho de compras - CORRIGIDAS
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
        
        plusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (cart[index].quantity < 10) {
                    cart[index].quantity++;
                    updateCartDisplay();
                }
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
        currentProduct = null;
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

    // Função para adicionar ao carrinho - SOLUÇÃO PARA O PROBLEMA 2
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
        
        // ALTERAÇÃO: Sempre adicionar como um novo item, independente de já existir no carrinho
        // Todos os itens serão adicionados individualmente, para que o tamanho seja selecionado para cada unidade
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
        
        // Atualizar o carrinho e fechar o modal
        updateCartDisplay();
        closeProductModal();
        
        // Abrir o carrinho para mostrar o item adicionado
        openCart();
    }

    // SOLUÇÃO PROBLEMA 2: Corrigido o envio do formulário de contato para o WhatsApp
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
            let whatsappMessage = `*Contato via Site - Estilo Único*%0A%0A`;
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

    // Event Listeners - CORRIGIDOS

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
            
            if (cart.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }
            
            // Coletar dados do formulário
            const nome = document.getElementById('checkout-nome').value.trim();
            const telefone = document.getElementById('checkout-telefone').value.trim();
            const endereco = document.getElementById('checkout-endereco').value.trim();
            const pagamento = document.getElementById('checkout-pagamento').value;
            const obs = document.getElementById('checkout-obs').value.trim();
            
            if (!nome || !telefone || !endereco || !pagamento) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Calcular o total do pedido
            const totalPedido = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            // Formatar a mensagem para o WhatsApp
            let whatsappMessage = `*Novo Pedido - Estilo Único*%0A%0A`;
            whatsappMessage += `*Cliente:* ${nome}%0A`;
            whatsappMessage += `*Telefone:* ${telefone}%0A`;
            whatsappMessage += `*Endereço:* ${endereco}%0A`;
            whatsappMessage += `*Forma de Pagamento:* ${document.getElementById('checkout-pagamento').options[document.getElementById('checkout-pagamento').selectedIndex].text}%0A%0A`;
            
            whatsappMessage += `*Itens do Pedido:*%0A`;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                whatsappMessage += `- ${item.quantity}x ${item.name} (Tamanho: ${item.size})%0A`;
                whatsappMessage += `   R$ ${itemTotal.toFixed(2).replace('.', ',')}%0A`;
            });
            
            whatsappMessage += `%0A*Total do Pedido:* R$ ${totalPedido.toFixed(2).replace('.', ',')}%0A%0A`;
            
            if (obs) {
                whatsappMessage += `*Observações:* ${obs}%0A%0A`;
            }
            
            // Redirecionar para o WhatsApp com formato correto - SOLUÇÃO PROBLEMA 2
            window.open(`https://wa.me/5583991816152?text=${whatsappMessage}`, '_blank');
            
            // Limpar o carrinho e fechar o modal
            cart = [];
            updateCartDisplay();
            closeCheckoutModal();
            
            // Mostrar confirmação
            alert('Seu pedido foi enviado com sucesso! Em breve entraremos em contato.');
        });
    }

    // Event listeners para a funcionalidade de pesquisa
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
                resetarFiltros(true);
            }
        });
    }

    // Botão para limpar a pesquisa principal
    if (mainSearchClear) {
        mainSearchClear.addEventListener('click', function() {
            mainSearchInput.value = '';
            resetarFiltros(true);
            mainSearchClear.classList.remove('active');
        });
    }

    // Botão para limpar a pesquisa na mensagem de "nenhum produto encontrado"
    if (limparPesquisa) {
        limparPesquisa.addEventListener('click', resetarFiltros);
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

    // Inicializar
    initScrollAnimations();

    // Apenas atualiza o contador, sem mostrar o carrinho
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems || '0';
    }
});