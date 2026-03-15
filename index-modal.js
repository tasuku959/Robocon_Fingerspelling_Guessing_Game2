document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('yubimozi-overlay');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalVideo = document.getElementById('modal-video');
  const modalVideoFallback = document.getElementById('modal-video-fallback');
  const modalTitle = document.getElementById('modal-title');
  const closeButton = document.getElementById('modal-close');

  const kanaLabels = [
    'わ','ら','や','ま','は','な','た','さ','か','あ',
    'よう音、促音','り','濁音','み','ひ','に','ち','し','き','い',
    'を','る','ゆ','む','ふ','ぬ','つ','す','く','う',
    '長音','れ','半濁音','め','へ','ね','て','せ','け','え',
    'ん','ろ','よ','も','ほ','の','と','そ','こ','お'
  ];

  // 各指文字ごとにセットする動画URL (MP4 or YouTube embed)
  const kanaVideoMap = {
    // 埋め込み対応確実にするなら /embed/ 形式を使う
    'あ': 'videos/a.mp4',
    'い': 'https://youtu.be/IRlUPHpAzmQ?si=p23S1CozUvlrR1yf',
    'う': 'videos/u.mp4',
    'え': 'videos/e.mp4',
    'お': 'videos/o.mp4',
    'か': 'videos/ka.mp4',
    'き': 'videos/ki.mp4',
    'く': 'videos/ku.mp4',
    'け': 'videos/ke.mp4',
    'こ': 'videos/ko.mp4',
    'さ': 'videos/sa.mp4',
    'し': 'videos/shi.mp4',
    'す': 'videos/su.mp4',
    'せ': 'videos/se.mp4',
    'そ': 'videos/so.mp4',
    // 他ラベルを追加可能
  };

  // 50個のクリックエリアを JS 自動生成
  kanaLabels.forEach((label, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'yubimozi-cell';
    cell.style.left = `${col * 10}%`;
    cell.style.top = `${row * 20}%`;
    cell.dataset.symbol = label;
    // kanaVideoMap から動画URLを取得、なければ空文字
    cell.dataset.video = kanaVideoMap[label] || '';
    cell.setAttribute('aria-label', `指文字 ${label}`);
    cell.style.pointerEvents = 'auto';

    cell.addEventListener('click', (event) => {
      event.stopPropagation();
      const videoFile = cell.dataset.video || '';
      modalTitle.textContent = `指文字: ${cell.dataset.symbol}`;

      // メディア領域リセット
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.innerHTML = '';
      modalVideo.style.display = 'none';
      modalVideoFallback.textContent = '動画ファイルが設定されていません。';

      if (!videoFile) {
        modalVideoFallback.textContent = '動画ファイルが設定されていません。';
      } else if (videoFile.includes('youtube.com/embed') || videoFile.includes('youtu.be')) {
        const iframe = document.createElement('iframe');
        iframe.src = videoFile.includes('youtu.be') ? videoFile.replace('youtu.be/', 'www.youtube.com/embed/') : videoFile;
        iframe.width = '100%';
        iframe.height = '360';
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        modalVideoFallback.textContent = '';
        const mediaContainer = document.getElementById('modal-media');
        mediaContainer.innerHTML = '';
        mediaContainer.appendChild(iframe);
      } else {
        const source = document.createElement('source');
        source.src = videoFile;
        source.type = 'video/mp4';
        modalVideo.appendChild(source);
        modalVideo.style.display = 'block';
        modalVideoFallback.textContent = '';
        const mediaContainer = document.getElementById('modal-media');
        mediaContainer.innerHTML = '';
        mediaContainer.appendChild(modalVideo);
        mediaContainer.appendChild(modalVideoFallback);
      }

      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
      if (modalVideo.style.display === 'block') {
        modalVideo.load();
        modalVideo.play().catch(() => {
          // mute/オートプレイ制限があれば無視
        });
      }
    });

    overlay.appendChild(cell);
  });

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    const mediaContainer = document.getElementById('modal-media');
    mediaContainer.innerHTML = '';
    mediaContainer.appendChild(modalVideo);
    mediaContainer.appendChild(modalVideoFallback);
    modalVideoFallback.textContent = '動画ファイルが設定されていません。';
  };

  closeButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
});
