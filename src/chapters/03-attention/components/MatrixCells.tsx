import React from 'react';
import type { MatrixStep } from '../types/attention.types';
import { MRaw, SRaw, ORaw } from '../utils/attention-constants';

interface MatrixCellsProps {
  matrixStep: MatrixStep;
}

export function MatrixCells({ matrixStep }: MatrixCellsProps) {
  const isScaled = matrixStep === 0;
  const isSoftmax = matrixStep === 1;
  const isOutput = matrixStep === 2;
  const COLS = 5;

  const getCell = (r: number, c: number) => {
    if (isOutput) {
      const v = ORaw[r][c];
      return { val: v.toFixed(2), cls: v > 0.7 ? 'a-softmax-hl' : '' };
    }
    if (isSoftmax) {
      const v = SRaw[r][c];
      return { val: v.toFixed(2), cls: v > 0.4 ? 'a-softmax-hl-red' : '' };
    }
    if (isScaled) {
      const v = MRaw[r][c] / 2;
      return { val: v.toFixed(1), cls: v > 5 ? 'a-hl-cross' : 'a-hl-row' };
    }
    const v = MRaw[r][c];
    return { val: v.toFixed(1), cls: v > 10 ? 'a-hl-cross' : 'a-hl-row' };
  };

  // 加权输出步骤：显示 O 结果矩阵（4×2）
  if (isOutput) {
    return (
      <>
        <div className='a-m-cell a-header a-show-cell' style={{borderBottom:'2px solid rgba(225,29,72,.3)'}}/>
        {['d₁', 'd₂'].map((v,i)=>(
          <div key={i} className='a-m-cell a-header a-show-cell' style={{color:'var(--V)'}}>
            <span className='a-token-tag' style={{background:'rgba(225,29,72,.1)',borderColor:'rgba(225,29,72,.3)',color:'var(--V)'}}>{v}</span>
          </div>
        ))}
        {['它','好','可','爱'].map((ch,r)=>(
          <React.Fragment key={ch}>
            <div className='a-m-cell a-header a-show-cell' style={{justifyContent:'flex-end'}}>
              <span className='a-token-tag a-q-tag'>{ch}</span>
            </div>
            {Array.from({length: 2},(_,c)=>{
              const info = getCell(r, c);
              return (
                <div
                  key={`${r}-${c}`}
                  className={`a-m-cell a-val ${info ? info.cls : ''}`}
                  style={{ borderColor:'rgba(225,29,72,.2)', opacity: 1, transform: 'scale(1)' }}
                >
                  {info ? info.val : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </>
    );
  }

  // 其他步骤：显示 4×5 矩阵
  return (
    <>
      <div className='a-m-cell a-header a-show-cell'/>
      {['有','一','只','小','猫'].map((v,i)=>(
        <div key={i} className='a-m-cell a-header a-show-cell'>
          <span className='a-token-tag a-k-tag'>{v}</span>
        </div>
      ))}
      {['它','好','可','爱'].map((ch,r)=>(
        <React.Fragment key={ch}>
          <div className='a-m-cell a-header a-show-cell' style={{justifyContent:'flex-end'}}>
            <span className='a-token-tag a-q-tag a-hl-active'>{ch}</span>
          </div>
          {Array.from({length: COLS},(_,c)=>{
            const info = getCell(r, c);
            return (
              <div
                key={`${r}-${c}`}
                className={`a-m-cell a-val ${info ? info.cls : ''}`}
                style={{ opacity: 1, transform: 'scale(1)' }}
              >
                {info ? info.val : ''}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
}
