---
order: 13
title:
  zh-CN: Todo
  en-US: Multiple dates
---

## zh-CN

Todo

## en-US

This property allows selecting multiple dates.

````jsx
import { DatePicker } from 'antd';

function onChange(date, dateString) {
  console.log(date, dateString);
}

ReactDOM.render(
  <div>
    <DatePicker onChange={onChange} multiple />
  </div>
, mountNode);
````
