import React, { type ReactNode } from 'react';
import './table.scss';

interface TableProps {
  tableTitle?: string[];
  checkbox?: boolean;
  checked?: boolean;
  onToggleSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: number;
  children?: ReactNode; // Svelte의 <slot /> 역할
}

const Table: React.FC<TableProps> = ({
  tableTitle = [],
  checkbox = false,
  checked = false,
  onToggleSelectAll,
  type = 0,
  children
}) => {
  // type에 따라 클래스명 분기
  const containerClass = type === 0 ? "table" : "table style";

  return (
    <div className={containerClass}>
      <table>
        <thead>
          <tr>
            {/* 체크박스 조건부 렌더링 */}
            {checkbox && (
              <th>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={onToggleSelectAll}
                />
              </th>
            )}
            
            {/* 제목 반복 렌더링 */}
            {tableTitle.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Svelte의 <slot />이 들어가는 자리 */}
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;