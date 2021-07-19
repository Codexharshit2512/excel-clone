import PerfectScrollbar from "perfect-scrollbar";

const ps = new PerfectScrollbar("#cells", {
  wheelSpeed: 10,
  wheelPropagation: true,
});

let defaultProperties = {
  "font-family": "Noto Sans",
  "font-size": 14,
  text: "",
  bold: false,
  italic: false,
  underlined: false,
  alignment: "left",
  color: "#444",
  bgcolor: "#fff",
  formula: "",
  upStream: [],
  downStream: [],
};

for (let i = 1; i <= 100; i++) {
  let str = "";
  let n = i;

  while (n > 0) {
    let rem = n % 26;
    if (rem == 0) {
      str = "Z" + str;
      n = Math.floor(n / 26) - 1;
    } else {
      str = String.fromCharCode(rem - 1 + 65) + str;
      n = Math.floor(n / 26);
    }
  }
  $("#columns").append(
    `<div class="column-name column-${i}" id="${str}">${str}</div>`
  );
  $("#rows").append(`<div class="row-name ${i}">${i}</div>`);
}
let cellData = [];
let sheets = {
  Sheet1: {},
};
let saved = true;
let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastSheetAdded = 1;
let sheetSelectedForSomeAction;
for (let i = 1; i <= 100; i++) {
  let row = $('<div class="cell-row"></div>');
  // let rowData = [];
  for (let j = 1; j <= 100; j++) {
    row.append(
      `<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`
    );
    // rowData.push({ ...defaultProperties });
  }
  $("#cells").append(row);
  // cellData.push(rowData);
}

function getRowColId(elem) {
  const classArr = $(elem).attr("id").split("-");
  const rowId = parseInt(classArr[1]);
  const colId = parseInt(classArr[3]);
  return [rowId, colId];
}

function grabAdjacentCells(elem) {
  const classArr = $(elem).attr("id").split("-");
  const rowId = parseInt(classArr[1]);
  const colId = parseInt(classArr[3]);
  // console.log(cellData[rowId - 1][colId - 1]);
  let topCell = $(`#row-${rowId - 1}-col-${colId}`);
  let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
  let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
  let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
  return [topCell, rightCell, bottomCell, leftCell];
}

$(".input-cell").on("click", function (e) {
  // console.log($(this));
  console.log(sheets);
  const [topCell, rightCell, bottomCell, leftCell] = grabAdjacentCells(this);
  // console.log(topCell.length);
  // if (topCell.length) console.log("topcell exists");
  if ($(this).hasClass("selected") && e.ctrlKey) {
    // unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    return unselectCells(this, topCell, rightCell, bottomCell, leftCell);
  } else {
    selectCell(e, this, topCell, rightCell, bottomCell, leftCell);
  }
  // const [rowId, colId] = getRowColId(this);
  // console.log(cellData[rowId - 1][colId - 1]);
});

$(".input-cell").dblclick(function (e) {
  $(this).attr("contenteditable", true);
  $(this).focus();
});

$(".input-cell").blur(function (e) {
  $(this).attr("contenteditable", false);
  updateCellData("text", $(this).text());
});

function getSelectedBooleans(topCell, rightCell, bottomCell, leftCell) {
  let topSelected, rightSelected, bottomSelected, leftSelected;
  // console.log(e.ctrlKey);

  if (topCell) {
    topSelected = topCell.hasClass("selected");
  }

  if (bottomCell) {
    bottomSelected = bottomCell.hasClass("selected");
  }

  if (rightCell) {
    rightSelected = rightCell.hasClass("selected");
  }

  if (leftCell) {
    leftSelected = leftCell.hasClass("selected");
  }

  return [topSelected, rightSelected, bottomSelected, leftSelected];
}

function selectCell(e, cell, topCell, rightCell, bottomCell, leftCell) {
  if (e.ctrlKey) {
    // if ($(cell).hasClass("selected")) {
    //   return unselectCells(cell, topCell, rightCell, bottomCell, leftCell);
    // }

    const [topSelected, rightSelected, bottomSelected, leftSelected] =
      getSelectedBooleans(topCell, rightCell, bottomCell, leftCell);

    if (topSelected) {
      $(cell).addClass("top-selected");
      topCell.addClass("bottom-selected");
    }

    if (rightSelected) {
      $(cell).addClass("right-selected");
      rightCell.addClass("left-selected");
    }

    if (bottomSelected) {
      $(cell).addClass("bottom-selected");
      bottomCell.addClass("top-selected");
    }

    if (leftSelected) {
      $(cell).addClass("left-selected");
      leftCell.addClass("right-selected");
    }
  } else {
    $(".input-cell.selected").removeClass(
      "selected top-selected bottom-selected left-selected right-selected"
    );
  }
  $(cell).addClass("selected");
  changeHeader(getRowColId(cell));
}

function unselectCells(cell, topCell, rightCell, bottomCell, leftCell) {
  const [topSelected, rightSelected, bottomSelected, leftSelected] =
    getSelectedBooleans(topCell, rightCell, bottomCell, leftCell);
  if (topSelected) {
    topCell.removeClass("bottom-selected");
    $(cell).removeClass("top-selected");
  }

  if (rightSelected) {
    rightCell.removeClass("left-selected");
    $(cell).removeClass("right-selected");
  }

  if (bottomSelected) {
    bottomCell.removeClass("top-selected");
    $(cell).removeClass("bottom-selected");
  }

  if (leftSelected) {
    leftCell.removeClass("right-selected");
    $(cell).removeClass("left-selected");
  }

  $(cell).removeClass("selected");
  $(cell).blur();
}
let startCellSelected = false;
let startCell = {};
let endCell = {};
$(".input-cell").mousemove(function (e) {
  e.preventDefault();
  if (e.buttons == 1) {
    if (!startCellSelected) {
      startCellSelected = true;
      let [rowId, colId] = getRowColId(this);
      startCell = { rowId, colId };
      // console.log("sc ", startCell);
      //
    }
  } else {
    startCellSelected = false;
  }
});

$(".input-cell").mouseenter(function (e) {
  if (e.buttons == 1) {
    let [rowId, colId] = getRowColId(this);
    endCell = { rowId, colId };
    // console.log("ec", endCell);
    selectBetweenCell(startCell, endCell);
  }
});

function selectBetweenCell(start, end) {
  $(".input-cell.selected").removeClass(
    "selected top-selected bottom-selected left-selected right-selected"
  );
  // console.log(start, end);
  for (
    let i = Math.min(start.rowId, end.rowId);
    i <= Math.max(start.rowId, end.rowId);
    i++
  ) {
    for (
      let j = Math.min(start.colId, end.colId);
      j <= Math.max(start.colId, end.colId);
      j++
    ) {
      const cell = $(`#row-${i}-col-${j}`)[0];
      const [topCell, rightCell, bottomCell, leftCell] =
        grabAdjacentCells(cell);

      selectCell(
        { ctrlKey: true },
        cell,
        topCell,
        rightCell,
        bottomCell,
        leftCell
      );
    }
  }
}

function changeHeader([rowId, colId]) {
  if (
    sheets[selectedSheet][rowId - 1] &&
    sheets[selectedSheet][rowId - 1][colId - 1]
  ) {
    const {
      alignment: data,
      bold,
      italic,
      underlined,
      ...rest
    } = sheets[selectedSheet][rowId - 1][colId - 1];
    $(".alignment").removeClass("selected");
    $(`.alignment[data-type=${data}]`).addClass("selected");
    setHeaderStyle("#bold", bold);
    setHeaderStyle("#italic", italic);
    setHeaderStyle("#underlined", underlined);
    $("#fill-color").css("border-color", rest.bgcolor);
    $("#text-color").css("border-color", rest.color);
    $("#font-family").val(rest["font-family"]);
    $("#font-size").val(rest["font-size"]);
    $("#font-family").css("font-family", rest["font-family"]);
  } else {
    $(".alignment").removeClass("selected");
    $(`.alignment[data-type=left]`).addClass("selected");
    setHeaderStyle("#bold", defaultProperties["bold"]);
    setHeaderStyle("#italic", defaultProperties["italic"]);
    setHeaderStyle("#underlined", defaultProperties["underlined"]);
    $("#fill-color").css("border-color", defaultProperties["bgcolor"]);
    $("#text-color").css("border-color", defaultProperties["color"]);
    $("#font-family").val(defaultProperties["font-family"]);
    $("#font-size").val(defaultProperties["font-size"]);
    $("#font-family").css("font-family", defaultProperties["font-family"]);
  }
}

function setHeaderStyle(id, property) {
  if (property) $(id).addClass("selected");
  else $(id).removeClass("selected");
}

$(`.alignment`).click(function (e) {
  $(".alignment").removeClass("selected");
  $(this).addClass("selected");
  let align = $(this).attr("data-type");
  $(".input-cell.selected").css("text-align", align);
  updateCellData("alignment", align);
});

$("#bold").click(function (e) {
  if (!$(this).hasClass("selected")) {
    $(".input-cell.selected").css("font-weight", "bold");
    updateCellData("bold", true);
  } else {
    $(".input-cell.selected").css("font-weight", 400);
    updateCellData("bold", false);
  }
  $(this).toggleClass("selected");
});

$("#italic").click(function (e) {
  if (!$(this).hasClass("selected")) {
    $(".input-cell.selected").css("font-style", "italic");
    updateCellData("italic", true);
  } else {
    $(".input-cell.selected").css("font-style", "normal");
    updateCellData("italic", false);
  }
  $(this).toggleClass("selected");
});

$("#underlined").click(function (e) {
  if (!$(this).hasClass("selected")) {
    $(".input-cell.selected").css("text-decoration", "underline");
    updateCellData("underlined", true);
  } else {
    $(".input-cell.selected").css("text-decoration", "none");
    updateCellData("underlined", false);
  }
  $(this).toggleClass("selected");
});

$("#cells").scroll(function (e) {
  $("#columns").scrollLeft(this.scrollLeft);
  $("#rows").scrollTop(this.scrollTop);
});
// $(".pick-color").click(() => console.log("cliecked"));
$(".pick-color").colorPick({
  initialColor: "#abcd",
  allowRecent: true,
  recentMax: 5,
  allowCustomColor: false,
  palette: [
    "#1abc9c",
    "#16a085",
    "#2ecc71",
    "#27ae60",
    "#3498db",
    "#2980b9",
    "#9b59b6",
    "#8e44ad",
    "#34495e",
    "#2c3e50",
    "#f1c40f",
    "#f39c12",
    "#e67e22",
    "#d35400",
    "#e74c3c",
    "#c0392b",
    "#ecf0f1",
    "#bdc3c7",
    "#95a5a6",
    "#7f8c8d",
  ],
  onColorSelected: function () {
    // this.element.css({ backgroundColor: this.color, color: this.color });
    if (this.color != "#ABCD") {
      const id = $(this.element.children()[1]).attr("id");
      // console.log(id);
      $(this.element.children()[1]).css("border-color", this.color);
      if (id == "fill-color") {
        $(".input-cell.selected").css("background-color", this.color);
        updateCellData("bgcolor", this.color);
      } else {
        $(".input-cell.selected").css("color", this.color);
        updateCellData("color", this.color);
      }
    }

    // console.log(this.element.children()[0]);
  },
});

$(".add-sheet").click(function (e) {
  totalSheets++;
  lastSheetAdded++;
  $(".sheet-tab").removeClass("selected");
  $(".sheet-tab-container").append(
    `<div class="sheet-tab selected">Sheet${lastSheetAdded}</div>`
  );
  sheets[$(".sheet-tab.selected").text()] = {};
  addSheetListeners();
  emptyPreviousSheet();
  selectedSheet = $(".sheet-tab.selected").text();
  $(".sheet-tab.selected")[0].scrollIntoView({ behaviour: "smooth" });
  saved = false;
});

function addSheetListeners() {
  $(".sheet-tab.selected").click(function (e) {
    if ($(this).text() != selectedSheet) {
      $(".sheet-tab").removeClass("selected");
      $(this).addClass("selected");
      emptyPreviousSheet();
      selectedSheet = $(this).text();
      $(".sheet-tab").removeClass("selected");
      $(this).addClass("selected");
      loadNewSheet();
    }
  });
  $(".sheet-tab.selected").on("contextmenu", function (e) {
    e.preventDefault();
    selectSheet(this);
    $(".sheet-options-modal").remove();
    $(".container").append(`<div class="sheet-options-modal">
    <div class="option sheet-rename">Rename</div>
    <div class="option sheet-delete">Delete</div>
  </div>`);
    $(".sheet-options-modal").css({
      left: e.pageX,
    });
    $(".sheet-rename").click(handleRenameSheet);
    $(".sheet-delete").click(handleDeleteSheet);
  });
}

$(".sheet-tab").on("contextmenu", function (e) {
  e.preventDefault();
  console.log("clicked context");
  selectSheet(this);
  $(".sheet-options-modal").remove();
  $(".container").append(`<div class="sheet-options-modal">
  <div class="option sheet-rename">Rename</div>
  <div class="option sheet-delete">Delete</div>
</div>`);
  $(".sheet-options-modal").css({
    left: e.pageX,
  });
  $(".sheet-rename").click(handleRenameSheet);
  $(".sheet-delete").click(handleDeleteSheet);
});

function selectSheet(elem) {
  emptyPreviousSheet();
  selectedSheet = $(elem).text();
  $(".sheet-tab").removeClass("selected");
  $(elem).addClass("selected");
  loadNewSheet();
}

$(".sheet-tab").click(function (e) {
  if ($(this).text() != selectedSheet) {
    selectSheet(this);
  }
});

function emptyPreviousSheet() {
  let rowKeys = Object.keys(sheets[selectedSheet]);
  // console.log("rowkeys", rowKeys);
  for (let i of rowKeys) {
    let colKeys = Object.keys(sheets[selectedSheet][i]);
    for (let j of colKeys) {
      let cell = $(`#row-${parseInt(i) + 1}-col-${parseInt(j) + 1}`);
      // console.log(cell);
      cell.text("");
      cell.css({
        "font-family": "Noto Sans",
        "font-size": 14,
        "font-weight": 400,
        "font-style": "none",
        "text-decoration": "none",
        "text-align": "left",
        color: "#444",
        "background-color": "#fff",
      });
    }
  }
}

function loadNewSheet() {
  let rowKeys = Object.keys(sheets[selectedSheet]);
  for (let i of rowKeys) {
    let colKeys = Object.keys(sheets[selectedSheet][i]);
    for (let j of colKeys) {
      let cell = $(`#row-${parseInt(i) + 1}-col-${parseInt(j) + 1}`);
      cell.text(sheets[selectedSheet][i][j]["text"]);
      cell.css({
        "font-family": sheets[selectedSheet][i][j]["font-family"],
        "font-size": sheets[selectedSheet][i][j]["font-size"],
        "font-weight": sheets[selectedSheet][i][j]["bold"] ? "bold" : 400,
        "font-style": sheets[selectedSheet][i][j]["italic"] ? "italic" : "none",
        "text-decoration": sheets[selectedSheet][i][j]["underlined"]
          ? "underline"
          : "none",
        "text-align": sheets[selectedSheet][i][j]["alignment"],
        color: sheets[selectedSheet][i][j]["color"],
        "background-color": sheets[selectedSheet][i][j]["bgcolor"],
      });
    }
  }
}

function handleRenameSheet(e) {
  let modal = $(`<div class="sheet-modal-parent">
  <div class="sheet-rename-modal">
      <div class="sheet-modal-title">Rename Sheet</div>
      <div class="sheet-modal-input-container">
          <span class="sheet-modal-input-title">Rename Sheet to:</span>
          <input class="sheet-modal-input" type="text" />
      </div>
      <div class="sheet-modal-confirmation">
          <div class="button yes-button">OK</div>
          <div class="button no-button">Cancel</div>
      </div>
  </div>
</div>`);
  $(".container").append(modal);
  $(".no-button").click(function (e) {
    $(".sheet-modal-parent").remove();
  });
  $(".yes-button").click(() => {
    let val = $(".sheet-modal-input").val();
    if (val && !Object.keys(sheets).includes(val)) {
      sheets[val] = { ...sheets[selectedSheet] };
      let copySheets = {};
      Object.keys(sheets).forEach((sheet) => {
        if (sheet != selectedSheet) {
          copySheets[sheet] = { ...sheets[sheet] };
        } else {
          copySheets[val] = { ...sheets[sheet] };
        }
      });
      $(".sheet-tab").each((index, elem) => {
        if ($(elem).text() === selectedSheet) {
          $(elem).text(val);
        }
      });
      sheets = { ...copySheets };
      selectedSheet = val;
      saved = false;
    } else {
      $(".rename-error").remove();
      $(".sheet-modal-input-container").append(
        `<div class="rename-error">Sheet already exists or please enter a value</div>`
      );
    }
    $(".sheet-modal-parent").remove();
  });
}

$(".container").click(function (e) {
  $(".sheet-options-modal").remove();
});

function handleDeleteSheet(e) {
  let modal = $(`<div class="sheet-modal-parent">
  <div class="sheet-delete-modal">
      <div class="sheet-modal-title">Sheet Name</div>
      <div class="sheet-modal-detail-container">
          <span class="sheet-modal-detail-title">Are you sure?</span>
      </div>
      <div class="sheet-modal-confirmation">
          <div class="button yes-button">
              <div class="material-icons delete-icon">delete</div>
              Delete
          </div>
          <div class="button no-button">Cancel</div>
      </div>
  </div>
</div>`);
  $(".container").append(modal);
  $(".no-button").click(function (e) {
    $(".sheet-modal-parent").remove();
  });
  $(".yes-button").click(function (e) {
    let keys = Object.keys(sheets);
    let deletedSheet = selectedSheet;
    keys.forEach((sheet, index) => {
      console.log("deleted", deletedSheet);
      if (sheet === deletedSheet) {
        console.log("index", index);
        if (index == keys.length - 1) {
          selectSheet($(".sheet-tab")[0]);
        } else {
          selectSheet($(".sheet-tab")[index + 1]);
        }
        delete sheets[deletedSheet];
      }
    });
    $(".sheet-tab").each((idx, elem) => {
      if ($(elem).text() === deletedSheet) {
        $(elem).remove();
      }
    });
    $(".sheet-modal-parent").remove();
    totalSheets--;
    saved = false;
  });
}

$(".left-scroller").click(function (e) {
  let keys = Object.keys(sheets);
  let index = keys.indexOf(selectedSheet);
  if (index != 0) {
    selectSheet($(".sheet-tab")[index - 1]);
    $(".sheet-tab")[index - 1].scrollIntoView({ behaviour: "smooth" });
  }
});

$(".right-scroller").click(function (e) {
  let keys = Object.keys(sheets);
  let index = keys.indexOf(selectedSheet);
  if (index != keys.length - 1) {
    selectSheet($(".sheet-tab")[index + 1]);
    $(".sheet-tab")[index + 1].scrollIntoView({ behaviour: "smooth" });
  }
});

$(".menu-selector").change(function (e) {
  const value = $(this).val();
  const id = $(this).attr("id");
  if (id == "font-family") {
    $(".input-cell.selected").css("font-family", value);
    updateCellData("font-family", value);
  } else {
    const num = parseInt(value);
    $(".input-cell.selected").css("font-size", num);
    updateCellData("font-size", num);
  }
});

function updateCellData(property, value) {
  let oldCellData = JSON.stringify(sheets);
  if (value != defaultProperties[property]) {
    $(".input-cell.selected").each((idx, data) => {
      let [rowId, colId] = getRowColId(data);
      if (sheets[selectedSheet][rowId - 1] == undefined) {
        sheets[selectedSheet][rowId - 1] = {};
        sheets[selectedSheet][rowId - 1][colId - 1] = {
          ...defaultProperties,
          upStream: [],
          downStream: [],
        };
        sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
      } else {
        if (sheets[selectedSheet][rowId - 1][colId - 1] == undefined) {
          sheets[selectedSheet][rowId - 1][colId - 1] = {
            ...defaultProperties,
            upStream: [],
            downStream: [],
          };
          sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
        } else {
          sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
        }
      }
    });
  } else {
    $(".input-cell.selected").each((idx, data) => {
      let [rowId, colId] = getRowColId(data);
      if (
        sheets[selectedSheet][rowId - 1] &&
        sheets[selectedSheet][rowId - 1][colId - 1]
      ) {
        sheets[selectedSheet][rowId - 1][colId - 1][property] = value;
        if (
          JSON.stringify(sheets[selectedSheet][rowId - 1][colId - 1]) ==
          JSON.stringify(defaultProperties)
        ) {
          delete sheets[selectedSheet][rowId - 1][colId - 1];
          if (Object.keys(sheets[selectedSheet][rowId - 1]).length == 0)
            delete sheets[selectedSheet][rowId - 1];
        }
      }
    });
  }
  if (oldCellData !== JSON.stringify(sheets)) {
    saved = false;
  }
}

$("#menu-file").click(function (e) {
  const fileModal = $(` 
  <div class="file-modal-parent">
  <div class="file-modal">
  <div class="file-options-modal">
      <div class="close">
          <div class="material-icons close-icon">arrow_circle_down</div>
          <div>Close</div>
      </div>
      <div class="new">
          <div class="material-icons new-icon">insert_drive_file</div>
          <div>New</div>
      </div>
      <div class="open">
          <div class="material-icons open-icon">folder_open</div>
          <div>Open</div>
      </div>
      <div class="save">
          <div class="material-icons save-icon">save</div>
          <div>Save</div>
      </div>
  </div>
  <div class="file-recent-modal"></div>
</div></div>`);
  $(".container").append(fileModal);
  $(".close").click(function (e) {
    console.log("clicked");
    $(".file-modal-parent").remove();
  });

  $(".file-modal-parent").click(function (e) {
    $(this).remove();
  });

  $(".file-modal").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });

  $(".open").click(function (e) {
    openFile();
    $(".file-modal-parent").remove();
  });

  $(".new").click(function (e) {
    $(".file-modal-parent").remove();
    if (!saved) {
      const sureModal = $(`<div class="sheet-modal-parent">
       <div class="sheet-delete-modal">
           <div class="sheet-modal-title">${$(".title").text()}</div>
           <div class="sheet-modal-detail-container">
               <span class="sheet-modal-detail-title">Do you want to save the unsaved changes?</span>
           </div>
           <div class="sheet-modal-confirmation">
               <div class="button yes-button">
                   Yes
               </div>
               <div class="button no-button">No</div>
           </div>
       </div>
     </div>`);
      $(".container").append(sureModal);
      $(".yes-button").click(function (e) {
        $(".sheet-modal-parent").remove();
        saveFile(true);
      });
      $(".no-button").click(function (e) {
        $(".sheet-modal-parent").remove();
        openNewFile();
      });
    } else {
      openNewFile();
    }
  });

  $(".save").click(function (e) {
    $(".file-modal-parent").remove();
    saveFile();
  });
});

function openNewFile() {
  emptyPreviousSheet();
  selectedSheet = "Sheet1";
  sheets = { Sheet1: {} };
  totalSheets = 1;
  lastSheetAdded = 1;
  $(".sheet-tab").remove();
  $(".sheet-tab-container").append(
    `<div class="sheet-tab selected">Sheet1</div>`
  );
  $(".title").text("Excel-Book");
  $("#row-1-col-1").click();
}

function saveFile(newClicked) {
  const saveModal = $(`<div class="sheet-modal-parent">
    <div class="sheet-rename-modal">
        <div class="sheet-modal-title">Save File</div>
        <div class="sheet-modal-input-container">
            <span class="sheet-modal-input-title">Enter File Name:</span>
            <input class="sheet-modal-input" type="text" />
        </div>
        <div class="sheet-modal-confirmation">
            <div class="button yes-button">OK</div>
            <div class="button no-button">Cancel</div>
        </div>
    </div>
  </div>`);
  $(".container").append(saveModal);
  $(".no-button").click(function (e) {
    $(".sheet-modal-parent").remove();
  });
  $(".yes-button").click(function (e) {
    $(".title").text($(".sheet-modal-input").val());
    let a = document.createElement("a");
    a.href = `data:application/json,${encodeURIComponent(
      JSON.stringify(sheets)
    )}`;
    console.log(a);
    a.download = $(".title").text() + ".json";
    $(".container").append(a);
    a.click();
    a.remove();
    saved = true;
    $(".sheet-modal-parent").remove();
    if (newClicked) {
      openNewFile();
    }
  });
}

function openFile() {
  let inputFile = $(`<input accept="application/json" type="file" />`);
  $(".container").append(inputFile);
  inputFile.click();
  inputFile.change(function (e) {
    let file = e.target.files[0];
    $(".title").text(file.name.split(".json")[0]);
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      emptyPreviousSheet();
      $(".sheet-tab").remove();
      sheets = JSON.parse(reader.result);
      console.log(sheets);
      let keys = Object.keys(sheets);
      lastlyAddedSheet = 1;
      for (let i of keys) {
        if (i.includes("Sheet")) {
          let splittedSheetArray = i.split("Sheet");
          if (splittedSheetArray.length == 2 && !isNaN(splittedSheetArray[1])) {
            lastlyAddedSheet = parseInt(splittedSheetArray[1]);
          }
        }
        $(".sheet-tab-container").append(
          `<div class="sheet-tab selected">${i}</div>`
        );
      }
      addSheetListeners();
      $(".sheet-tab").removeClass("selected");
      $($(".sheet-tab")[0]).addClass("selected");
      selectedSheet = keys[0];
      totalSheets = keys.length;
      loadNewSheet();
      inputFile.remove();
    };
  });
}
let clipBoard;
let contentCutted;
$(".copy,.cut").click(function (e) {
  if ($(this).text() === "content_cut") contentCutted = true;
  clipBoard = { startCell: [], cellData: {} };
  clipBoard.startCell = getRowColId($(".input-cell.selected")[0]);
  let { cellData } = clipBoard;
  $(".input-cell.selected").each((idx, elem) => {
    let [row, col] = getRowColId(elem);
    if (
      sheets[selectedSheet][row - 1] &&
      sheets[selectedSheet][row - 1][col - 1]
    ) {
      if (!cellData[row]) {
        cellData[row] = {};
      }
      cellData[row][col] = { ...sheets[selectedSheet][row - 1][col - 1] };
      if (contentCutted) {
        delete sheets[selectedSheet][row - 1][col - 1];
        if (Object.keys(sheets[selectedSheet][row - 1]).length == 0)
          delete sheets[selectedSheet][row - 1];
        let cell = $(`#row-${parseInt(row)}-col-${parseInt(col)}`);
        cell.text("");
        cell.css({
          "font-family": "Noto Sans",
          "font-size": 14,
          "font-weight": 400,
          "font-style": "none",
          "text-decoration": "none",
          "text-align": "left",
          color: "#444",
          "background-color": "#fff",
        });
      }
    }
  });
  console.log(clipBoard);
});

$(".paste").click(function (e) {
  let sCell = getRowColId($(".input-cell.selected")[0]);
  let { cellData } = clipBoard;
  let rows = Object.keys(cellData);
  console.log(rows);
  for (i of rows) {
    let cols = Object.keys(cellData[i]);
    for (j of cols) {
      let rowDiff = parseInt(i) - clipBoard.startCell[0];
      let colDiff = parseInt(j) - clipBoard.startCell[1];
      if (!sheets[selectedSheet][sCell[0] + rowDiff - 1]) {
        sheets[selectedSheet][sCell[0] + rowDiff - 1] = {};
      }
      sheets[selectedSheet][sCell[0] + rowDiff - 1][sCell[1] + colDiff - 1] =
        cellData[i][j];
    }
  }
  loadNewSheet();
  if (contentCutted) {
    contentCutted = false;
    clipBoard = { startCell: [], cellData: {} };
  }
});

$("#formula-input").blur(function (e) {
  if ($(".input-cell.selected").length > 0) {
    let formula = $(this).text();
    // console.log($(this).val());
    let splitArr = formula.split(" ");
    let elements = [];
    for (let i of splitArr) {
      if (i.length >= 2) {
        i = i.replace("(", "");
        i = i.replace(")", "");
        elements.push(i);
      }
    }
    $(".input-cell.selected").each((index, elem) => {
      if (updateStream(elem, elements)) {
        console.log("passed");
      } else {
        console.log("not");
      }
    });
    console.log(elements);
  } else {
    alert("!Please select a cell to apply the formula");
  }
});

function updateStream(elem, elements) {
  let [rowId, colId] = getRowColId(elem);
  let selfCode = $(`.column-${colId}`).attr("id") + rowId;
  if (elements.includes(selfCode)) {
    return false;
  }
  return true;
}

console.log("hello parcel");
