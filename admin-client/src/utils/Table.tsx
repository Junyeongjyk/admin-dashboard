import React, { useState, useEffect } from 'react';

interface SortColumn {
  col: string;
  title: string;
}

interface IconState {
  up: boolean;
  down: boolean;
}

interface TableProps {
  tableTitle: string[];
  checkbox?: boolean;
  checked?: boolean;
  onToggleSelectAll?: () => void;
  type?: number;
  sortColumns?: SortColumn[];
  tableTitleColumns?: number[];
  searchForm: [number, string, string, string];
  handleGetList: () => void;
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({
  tableTitle = [],
  checkbox = false,
  checked = false,
  onToggleSelectAll,
  type = 0,
  sortColumns = [],
  tableTitleColumns = [],
  searchForm,
  handleGetList,
  children,
}) => {
  const ASC = 'ASC';
  const DESC = 'DESC';

  // Svelte의 $: iconStates 로직을 useState와 useEffect로 구현
  const [iconStates, setIconStates] = useState<IconState[]>([]);

  useEffect(() => {
    setIconStates(
      new Array(tableTitle.length).fill(null).map(() => ({ up: false, down: false }))
    );
  }, [tableTitle.length]);

  const resetIcons = (currentIndex: number) => {
    return iconStates.map((state, idx) => 
      idx === currentIndex ? state : { up: false, down: false }
    );
  };

  const toggleIcon = (index: number, item: string) => {
    const column = sortColumns.find((c) => c.title === item);
    if (!column) return;

    let nextStates = [...iconStates];
    const currentState = iconStates[index];

    if (currentState.down) {
      // DESC -> ASC
      searchForm[2] = column.col;
      searchForm[3] = ASC;
      nextStates[index] = { up: true, down: false };
    } else if (currentState.up) {
      // ASC -> 초기화
      searchForm[2] = '';
      searchForm[3] = '';
      nextStates[index] = { up: false, down: false };
    } else {
      // 초기 상태 -> DESC
      searchForm[2] = column.col;
      searchForm[3] = DESC;
      // 다른 컬럼의 아이콘은 모두 초기화 (Svelte의 resetIcon 로직)
      nextStates = new Array(tableTitle.length).fill(null).map(() => ({ up: false, down: false }));
      nextStates[index] = { up: false, down: true };
    }

    setIconStates(nextStates);
    handleGetList();
  };

  return (
    <div className={`table ${type === 1 ? 'style-1' : ''}`}>
      <table>
        <thead>
          <tr>
            {checkbox && (
              <th>
                <input 
                  type="checkbox" 
                  checked={checked} 
                  onChange={onToggleSelectAll} 
                />
              </th>
            )}
            {tableTitle.map((item, index) => (
              <th 
                key={index} 
                className={tableTitleColumns.includes(index) ? 'thlist' : ''}
              >
                <div className="up-down">
                  {sortColumns.some((column) => column.title === item) ? (
                    <>
                      <button 
                        className="toggleIcon" 
                        onClick={() => toggleIcon(index, item)} 
                      />
                      {item}
                      <div className="icon-group">
                        <i className={`fa-solid fa-caret-up up-long ${iconStates[index]?.up ? 'active' : ''}`}></i>
                        <i className={`fa-solid fa-caret-down down-long ${iconStates[index]?.down ? 'active' : ''}`}></i>
                      </div>
                    </>
                  ) : (
                    item
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;