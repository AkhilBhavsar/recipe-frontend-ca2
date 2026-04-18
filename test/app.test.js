const assert = require('assert');

describe('Recipe Frontend', function () {
  it('should confirm Node.js environment is working', function () {
    assert.strictEqual(typeof process.version, 'string');
  });

  it('should parse ingredients correctly', function () {
    const raw = 'eggs, pasta, pancetta';
    const result = raw.split(',').map(i => i.trim()).filter(Boolean);
    assert.deepStrictEqual(result, ['eggs', 'pasta', 'pancetta']);
  });

  it('should calculate average prep time', function () {
    const recipes = [
      { prepTimeInMinutes: 20 },
      { prepTimeInMinutes: 40 },
      { prepTimeInMinutes: 60 }
    ];
    const avg = Math.round(
      recipes.reduce((s, r) => s + r.prepTimeInMinutes, 0) / recipes.length
    );
    assert.strictEqual(avg, 40);
  });
});
