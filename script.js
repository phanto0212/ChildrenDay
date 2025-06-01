// Tập hợp love được chạm
const loveTaps = new Set();
// Thiết lập tên mặc định
let userName = 'My'; // Thay "Bé Iuu" bằng tên bạn muốn sử dụng

// Thêm biến để theo dõi số lần trái tim cuối cùng đã nhảy
let lastHeartJumpCount = 0;
let lastHeartId = null;

function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Thiếu một trong các element stage!');
    return;
  }

  // Chuyển trực tiếp từ startStage sang loveStage, bỏ qua inputStage
  stages.startStage.style.display = 'none';
  stages.loveStage.style.display = 'block';
  stages.cardStage.style.display = 'none';

  document.getElementById('bgMusic')?.play().catch(err =>
    console.warn('Không thể phát nhạc:', err)
  );

  // Khởi tạo trạng thái ban đầu
  resetLoveIcons();
}

// Hàm reset các icon tim
function resetLoveIcons() {
  loveTaps.clear();
  document.querySelectorAll('.love-icon').forEach(icon =>
    icon.classList.remove('tapped')
  );
}

// Hiệu ứng gõ chữ
typeWriterEffect = (text, elementId, callback) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy element với ID: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 50;
  element.textContent = '';

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      console.log('Hiệu ứng gõ hoàn tất');
      callback?.();
    }
  };

  type();
};

function switchStage(fromId, toId, withFade = false) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Không tìm thấy element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (withFade) {
    fromElement.classList.add('hidden');
    setTimeout(() => {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
    }, 1000);
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
  }
}

function showConfetti() {
  const duration = 3000;
  const particleCount = 100;
  const colors = ['#ff4081', '#ffb74d', '#64b5f6', '#81c784', '#ba68c8'];
  
  confetti({
    particleCount,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    scalar: 1.2,
  });
  
  // Thêm một đợt confetti nữa sau 500ms
  setTimeout(() => {
    confetti({
      particleCount: particleCount / 2,
      spread: 130,
      origin: { y: 0.7 },
      colors,
      scalar: 0.9,
    });
  }, 500);
}

// Hàm để tìm ID của trái tim cuối cùng chưa được chạm
function findLastHeart() {
  for (let i = 1; i <= 4; i++) {
    if (!loveTaps.has(i)) {
      return i;
    }
  }
  return null;
}

// Hàm để di chuyển trái tim đến vị trí ngẫu nhiên
function moveHeartToRandomPosition(heartId) {
  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${heartId})`);
  const container = document.getElementById('loveIcons');
  
  // Kích thước container
  const containerRect = container.getBoundingClientRect();
  
  // Kích thước trái tim
  const heartSize = loveIcon.offsetWidth;
  
  // Tính toán vị trí mới, giữ trong giới hạn container
  const maxX = containerRect.width - heartSize;
  const maxY = containerRect.height - heartSize;
  
  // Tạo vị trí ngẫu nhiên
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  
  // Áp dụng hiệu ứng và vị trí mới
  loveIcon.style.transition = 'all 0.3s ease';
  loveIcon.style.position = 'absolute';
  loveIcon.style.left = `${randomX}px`;
  loveIcon.style.top = `${randomY}px`;
  loveIcon.style.zIndex = '100';
  
  // Thêm hiệu ứng nhảy
  loveIcon.animate([

    { transform: 'scale(1)', opacity: 0.7 },
    { transform: 'scale(1.2)', opacity: 1 },
    { transform: 'scale(1)', opacity: 0.7 }
  ], {
    duration: 300,
    iterations: 1
  });
}

// Cập nhật hàm tapLove để xử lý trái tim cuối cùng
function tapLove(id, event) {
  if (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
  }
  
  if (loveTaps.has(id)) return;

  // Kiểm tra nếu đã chạm 3 tim và đây là tim cuối cùng
  if (loveTaps.size === 3) {
    // Xác định ID của trái tim cuối cùng nếu chưa biết
    if (lastHeartId === null) {
      lastHeartId = findLastHeart();
    }
    
    // Nếu đang cố gắng chạm vào trái tim cuối cùng
    if (id === lastHeartId) {
      // Nếu chưa nhảy đủ 4 lần, di chuyển nó
      if (lastHeartJumpCount < 6) {
        lastHeartJumpCount++;
        moveHeartToRandomPosition(id);
        
        // Thêm hiệu ứng rung nếu thiết bị hỗ trợ
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(30);
        }
        
        // Hiển thị tin nhắn nhỏ
        const messages = [
          "Hihi, bắt anh đi!",
          "Không dễ đâu nha!",
          "Lần cuối nè!",
          "Haha dễ lừa ghê 🤣",
          "Thôi không dỗi lần cuối nè 😘 ",
          "Yêu anh không? ❤️",

        ];
        
        // Tạo và hiển thị thông báo nhỏ
        const msg = document.createElement('div');
        msg.className = 'heart-message';
        msg.textContent = messages[lastHeartJumpCount-1];
        msg.style.position = 'absolute';
        msg.style.color = '#ff4081';
        msg.style.fontWeight = 'bold';
        msg.style.fontSize = '16px';
        msg.style.top = '0';
        msg.style.left = '0';
        msg.style.transform = 'translateY(-100%)';
        msg.style.whiteSpace = 'nowrap';
        msg.style.transition = 'opacity 0.5s';
        msg.style.opacity = '0';
        
        const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
        loveIcon.appendChild(msg);
        
        setTimeout(() => {
          msg.style.opacity = '1';
        }, 50);
        
        setTimeout(() => {
          msg.style.opacity = '0';
          setTimeout(() => {
            msg.remove();
          }, 500);
        }, 1500);
        
        return; // Dừng xử lý
      }
    }
  }

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  
  // Thêm hiệu ứng phản hồi
  loveIcon.classList.add('tapped');
  
  // Đặt lại style vị trí nếu đây là trái tim cuối cùng
  if (id === lastHeartId) {
    loveIcon.style.position = '';
    loveIcon.style.left = '';
    loveIcon.style.top = '';
  }
  
  // Thêm hiệu ứng rung nhẹ nếu thiết bị hỗ trợ
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50); // Rung 50ms
  }
  
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  // Kiểm tra nếu đã chạm đủ 4 tim
  if (loveTaps.size === 4) {
    showConfetti(); // Thêm hiệu ứng confetti
    
    Swal.fire({
      title: 'Cảm ơn em đã chạm đủ nha! 💕',
      text: 'Sẵn sàng nhận bất ngờ ngọt ngào từ anh chưa nào? 🎁',
      timer: 1500,
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
      // Reset lại các biến theo dõi trái tim cuối cùng
      lastHeartJumpCount = 0;
      lastHeartId = null;
      
      switchStage('loveStage', 'cardStage', true);
      
      // Thêm hiệu ứng confetti khi hiển thị bảng tin nhắn
      setTimeout(showConfetti, 1000);

      const loveMsg = document.getElementById('loveMsg');
      if (!loveMsg) return console.error('Không tìm thấy element loveMsg!');

      typeWriterEffect(
        `Chúc ${userName} của anh một ngày 1/6 thật vui vẻ, hồn nhiên như một đứa trẻ, nhưng luôn được anh yêu thương như một nữ hoàng 👑. Dù em có trưởng thành đến đâu, thì trong tim anh, em mãi là cô công chúa bé bỏng cần được anh cưng chiều mỗi ngày!`,
        'loveMsg',
        () => {
          const fromTag = document.createElement("div");
          fromTag.id = 'fromTag';
          fromTag.textContent = "From: Anh Cún :))";
          fromTag.style.marginTop = "20px";
          fromTag.style.opacity = "0";
          fromTag.style.transition = "opacity 1s ease";
          loveMsg.appendChild(fromTag);

          setTimeout(() => {
            fromTag.style.opacity = "1";
            // Thêm một đợt confetti nhỏ nữa khi hiển thị chữ ký
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#ff4081', '#ffb74d'],
            });
          }, 500);
        }
      );
    });
  }
}

// Thêm hàm khởi tạo để gắn sự kiện touch tốt hơn cho thiết bị di động
function initializeTouchEvents() {
  document.querySelectorAll('.love-icon').forEach((icon, index) => {
    // Xóa sự kiện click cũ nếu có
    icon.removeAttribute('onclick');
    
    // Thêm sự kiện touch mới
    icon.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định
      tapLove(index + 1, e);
    }, { passive: false });
    
    // Giữ lại sự kiện click cho desktop
    icon.addEventListener('click', function(e) {
      tapLove(index + 1, e);
    });
  });
}

// Cập nhật hàm startApp để khởi tạo sự kiện touch
function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Thiếu một trong các element stage!');
    return;
  }

  // Chuyển trực tiếp từ startStage sang loveStage, bỏ qua inputStage
  stages.startStage.style.display = 'none';
  stages.loveStage.style.display = 'block';
  stages.cardStage.style.display = 'none';

  document.getElementById('bgMusic')?.play().catch(err =>
    console.warn('Không thể phát nhạc:', err)
  );

  // Khởi tạo trạng thái ban đầu
  resetLoveIcons();
  
  // Khởi tạo sự kiện touch
  initializeTouchEvents();
}