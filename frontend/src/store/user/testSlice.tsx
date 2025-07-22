import { createSlice } from '@reduxjs/toolkit'

export interface ITestState = (): {} => {

}
const initialState: ITestState = {

};

const testSlice = createSlice({
name: 'test',
initialState,
reducers: {

}
extraReducers: (builder) => {

},
}),
export default testSlice.reducer;
