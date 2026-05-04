
/** Usage
 * status 0: 실패
 * status 1: 성공
 * status 2: 경고
 * status 3: 확인
 * 
 * status 0 or 1
 * popup("description", status);
 * 
 * status 2 or 3
 * popup("description", status, (data) => {
 *    if (data == false) return;
 *    ... callback 
 * });
 */

interface PopupOptions {
    icon: string;
    title: string;
    color: string;
}

const options: Array<PopupOptions> = [
    {icon: "xmark", title: '실패', color: "fail"},
    {icon: "check", title: '성공', color: "success"},
    {icon: "question", title: '확인', color: "confirm"},
    {icon: "exclamation", title: '경고', color: "danger"},
]

export const popup = async ( description: string = "", status?: number, callback?: any)  => {
    let popupElement: HTMLElement = document.createElement('div');
    popupElement.setAttribute("class", "popup bounce");
    document.querySelector("#app").appendChild(popupElement)

    let coverElement: HTMLElement = document.createElement('div');
    coverElement.setAttribute("class", "popup-cover fade");
    document.querySelector("#app").appendChild(coverElement)
    
    let popup = document.querySelectorAll(".popup")
    let popupCover = document.querySelectorAll(".popup-cover")
    popup[popup.length-1].innerHTML = popupContent(description, status);
    requestAnimationFrame(() => {
        popup[popup.length-1].classList.remove("bounce")
        popupCover[popupCover.length-1].classList.remove("fade")
    })

    let focusButton: HTMLButtonElement;
    status == 0 || status == 1
    ? focusButton = document.querySelectorAll("#popupClose")[document.querySelectorAll("#popupClose").length - 1] as HTMLButtonElement
    : focusButton = document.querySelectorAll("#popupConfirm")[document.querySelectorAll("#popupConfirm").length - 1] as HTMLButtonElement;
    focusButton?.focus()

    document.querySelectorAll("#popupClose")[document.querySelectorAll("#popupClose").length - 1]
        .addEventListener("click", () => {
            popupClose(false)
            if(status == 2 || status == 3) callback(false);
        })
    document.querySelectorAll("#popupConfirm")[document.querySelectorAll("#popupConfirm").length - 1]
        ?.addEventListener("click", () => {
            popupClose(true)
            callback(true)
        })
}

export const popupAsync = (description: string, status: number = 3): Promise<boolean> => {
  return new Promise((resolve) => {
    popup(description, status, (data: boolean) => {
      resolve(data); // true or false 반환
    });
  });
};

export const popupClose = (isConfirm: boolean = false): string | void => {
    let popup = document.querySelectorAll(".popup")
    let popupCover = document.querySelectorAll(".popup-cover")
    if(isConfirm == false){
        popup[popup.length-1].classList.add("bounce")
        popupCover[popupCover.length-1].classList.add("fade")
        setTimeout(() => {
            popupCover[popupCover.length-1].remove();
            popup[popup.length-1].remove();
        }, 200)
    } else {
        popupCover[popupCover.length-1].remove();
        popup[popup.length-1].remove();
    }
}

const popupContent = (description: string, status?: number, ): string => {

    status ??= 1
    if(status == -4) {
        status = 0;
    }
    if (!description) description = "";
    
    let contents: string = `
        <div class="popup__description">${description}</div>
        <div class="popup__button ${status <= 1 ? "center" : ""}">
            ${ status <= 1 
                ? `<button type="button" id="popupClose" class="blue">확인</button>` 
                : `<button type='button' id="popupClose" class="red">취소</button><button type='button' id="popupConfirm" class="blue">확인</button>`
            }  
        </div>
    `
    return contents
}
