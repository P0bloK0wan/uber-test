import test from "node:test";
import assert from "node:assert/strict";
import {
  cartTotals,
  rideQuote,
  nextRideState,
  nextOrderState,
  validateAddress,
  cartKey,
} from "../dist/model.js";
test("cart uses integer cents, charges extras per unit, and caps welcome discount", () => {
  const result = cartTotals(
    [{ price: 2590, qty: 2, extras: [{ price: 500 }] }],
    590,
    "BEMVINDO",
  );
  assert.deepEqual(result, {
    subtotal: 6180,
    delivery: 590,
    discount: 618,
    total: 6152,
    count: 2,
  });
  assert.equal(
    cartTotals([{ price: 20000, qty: 1, extras: [] }], 0, "BEMVINDO").discount,
    1000,
  );
  assert.equal(cartTotals([], 590, "BEMVINDO").total, 0);
});
test("unknown coupon does not reduce total", () =>
  assert.equal(
    cartTotals([{ price: 2000, qty: 1 }], 500, "INVALIDO").total,
    2500,
  ));
test("ride prices deterministic by category and distance", () => {
  assert.ok(rideQuote(12, "black").price > rideQuote(12, "x").price);
  assert.ok(rideQuote(20, "x").price > rideQuote(2, "x").price);
  assert.throws(() => rideQuote(-1, "x"));
  assert.throws(() => rideQuote(2, "invalid"));
});
test("cancelled/completed rides and orders stay terminal", () => {
  assert.equal(nextRideState("requested"), "arriving");
  assert.equal(nextRideState("arriving"), "traveling");
  assert.equal(nextRideState("traveling"), "completed");
  assert.equal(nextRideState("cancelled"), "cancelled");
  assert.equal(nextRideState("completed"), "completed");
  assert.equal(nextOrderState("preparing"), "delivering");
  assert.equal(nextOrderState("delivering"), "completed");
  assert.equal(nextOrderState("cancelled"), "cancelled");
});
test("address rejects missing house number; cart options keep separate line identities", () => {
  assert.equal(validateAddress("Rua Augusta", ""), false);
  assert.equal(validateAddress("Rua Augusta", "12"), true);
  assert.notEqual(
    cartKey("burger", ["cheese"], "sem cebola"),
    cartKey("burger", [], "sem cebola"),
  );
  assert.equal(
    cartKey("burger", ["b", "a"], ""),
    cartKey("burger", ["a", "b"], ""),
  );
});
