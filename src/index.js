import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
  // Front
  { position: [0, 0, 2], rotation: [0, 0, 0], url: 'img/2.jpg', title: 'GỌNG KÌM TÂM TRÍ', description: 'Trầm cảm không phải lựa chọn, mà là gông kìm vô hình tước đi tự do và nhấn chìm người trẻ trong nỗi đau lặng lẽ giữa sự thờ ơ của xã hội.' },
  // Back
  { position: [-3, 0, 0], rotation: [0, 0, 0], url: 'img/3.jpg', title: 'GÁNH NẶNG HÓA KHỐI', description: 'Dưới áp lực và cám dỗ xung quanh, khói thuốc và chất kích thích trở thành lối thoát sai lầm, dần bào mòn sức sống của người trẻ.' },
  { position: [3, 0, 0], rotation: [0, 0, 0], url: 'img/7.jpg', title: 'THIÊN THẦN BỊ KẾT ÁN', description: 'Sự khác biệt trở thành lời buộc tội, biến học sinh LGBT thành nạn nhân của phán xét và bạo lực được che đậy bằng cái gọi là “đúng đắn”.' },
  // Left
  { position: [-2.7, 0, 3], rotation: [0, Math.PI / 2.5, 0], url: 'img/4.jpg', title: 'VÒNG VÂY ÁO TRẮNG', description: 'Giữa lớp học, em đứng cô độc trong vòng vây kéo và ánh mắt lạnh lùng. Nỗi đau không nằm ở vết thương, mà ở sự im lặng tàn nhẫn của đám đông.' },
  { position: [-2.5, 0, 5.7], rotation: [0, Math.PI / 2.5, 0], url: '/img/1.jpg', title: 'CON RỐI HOÀN HẢO', description: 'Áp lực thành tích vô hình siết chặt. Đứa trẻ miệt mài chạy theo kỳ vọng, đánh đổi ước mơ riêng. Áp lực tạo nên kim cương, hay chỉ là sự mệt mỏi dưới lớp vỏ hoàn hảo?' },
  // Right
  { position: [2.7, 0, 3], rotation: [0, -Math.PI / 2.5, 0], url: 'img/5.jpg', title: 'LƯỚI DAO LỜI NÓI', description: 'Mỗi lời chế giễu, mỗi ánh nhìn phán xét như một vết dao vô hình, khắc sâu vào tâm trí và bào mòn sự tự tin của nạn nhân.' },
  { position: [2.5, 0, 5.7], rotation: [0, -Math.PI / 2.5, 0], url: 'img/6.jpg', title: 'LIỀU THUỐC MẠNG', description: 'Giữa dòng dopamine chóng vánh, người trẻ trở thành nạn nhân của quá tải thông tin và mất kết nối với thực tại.' }
]
createRoot(document.getElementById('root')).render(<App images={images} />)
