use wasm_bindgen::prelude::*;

use core;

#[wasm_bindgen]
pub fn synth(freq: f32, sec: u32, sample_rate: u32) -> Vec<f32> {
    core::synth(freq, sec, sample_rate)
}
