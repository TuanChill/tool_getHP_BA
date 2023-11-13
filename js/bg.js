const user = {
  msv: "24A4042615",
  password: "Aidayma2@",
};

const input = [
  { HP: "IS25A", LHP: "232IS25A01" },
  { HP: "MIS02A", LHP: "232MIS02A01" },
];

// const tinchis = ["IS25A", "IS46A"];

// const HP_name = ["232IS25A01", "232IS46A01"];

// const regexHP_atag = "/GetClassStudyUnit\('([^']+)','([^']+)','([^']+)'\)/";

let divDanhsachHp;
let scriptTagHp;

// Tạo một đối tượng MutationObserver với một hàm callback
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Kiểm tra nếu có thay đổi trong cấu trúc DOM, chẳng hạn như thêm hoặc xoá các phần tử con
    if (mutation.type === "childList") {
      // Thêm code xử lý sự kiện của bạn ở đây
      const trHocPhans = divDanhsachHp.getElementsByTagName("tr");
      console.log(trHocPhans);
      Array.from(trHocPhans).forEach((e) => {
        input.forEach((item) => {
          if (e.innerText.toLowerCase().includes(item.HP.toLowerCase())) {
            console.log(e);
            const atag = e.getElementsByTagName("a")[0];
            // console.log(atag.href)
            const idClassUnit = atag.href.match(
              /GetClassStudyUnit\('([^']+)','([^']+)','([^']+)'\)/
            )[1];
            console.log(idClassUnit);
            fetch(
              `http://regist.hvnh.edu.vn/DangKyHocPhan/DanhSachLopHocPhan?id=${idClassUnit}&registType=HB`
            )
              .then((res) => {
                return res.text();
              })
              .then((html) => {
                // console.log(html);
                // Create a new DOMParser
                const parser = new DOMParser();

                // Parse the HTML string
                const doc = parser.parseFromString(
                  html.toString(),
                  "text/html"
                );

                // Get the content within the tbody tag
                const tr_thisHP = doc.getElementsByTagName("tr");
                console.log(tr_thisHP);
                Array.from(tr_thisHP).forEach((e) => {
                  if (
                    e.innerText.toLowerCase().includes(item.LHP.toLowerCase())
                  ) {
                    const id_HP = e.getElementsByTagName("input")[0].id;
                    console.log(id_HP);
                    fetch(
                      `http://regist.hvnh.edu.vn/DangKyHocPhan/DangKy?Hide=${id_HP}|&acceptConflict=false&classStudyUnitConflictId=&RegistType=HB`
                    ).finally((res) => {
                      console.log(res);
                    });
                  }
                });
                // console.log(tbodyContent);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      });
    }
  });
});

// Thiết lập các tùy chọn cho MutationObserver
const observerOptions = {
  childList: true, // Bật theo dõi sự thay đổi trong danh sách con của targetDiv
  subtree: true, // Bật theo dõi sự thay đổi trong toàn bộ cây DOM con của targetDiv
};

const register = async () => {
  const currentHref = window.location.href;
  if (currentHref == "http://regist.hvnh.edu.vn/") {
    const HB = await document.getElementById("HB");
    if (HB) {
      await HB.click();
      if (HB.checked) {
        divDanhsachHp = await document.getElementById("cnDanhSachHP");
        scriptTagHp = await document.getElementsByTagName("script")[5];
        // Bắt đầu quan sát targetDiv với các tùy chọn đã thiết lập
        observer.observe(divDanhsachHp, observerOptions);
      }
    }
  } else {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
};
const func = () => {
  const currentHref = window.location.href;
  if (
    currentHref == "http://regist.hvnh.edu.vn/Login" ||
    currentHref == "http://regist.hvnh.edu.vn/Login/index"
  ) {
    const userName = document.getElementById("username");
    const password = document.getElementById("password");
    userName.value = user.msv;
    password.value = user.password;

    const form = document.getElementsByTagName("form")[0];

    form.submit();
  }
};

func();

register();

setTimeout(() => {
  window.location.reload();
}, 3000);
