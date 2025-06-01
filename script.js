// Tập hợp love được chạm
const loveTaps = new Set();
// Thiết lập tên mặc định
let userName = 'My'; // Thay "Bé Iuu" bằng tên bạn muốn sử dụng

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

function tapLove(id) {
  if (loveTaps.has(id)) return;

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  loveIcon.classList.add('tapped');
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  if (loveTaps.size === 4) {
    showConfetti(); // Thêm hiệu ứng confetti
    
    Swal.fire({
      title: 'Đủ 4 love rồi nè!',
      text: 'Sẵn sàng nhận quà chưa? 💖',
      timer: 1500,
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
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

// Đã loại bỏ hàm inipesan() vì không còn cần thiết