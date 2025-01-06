import { Example } from "./example";

export class ExampleLoader {
    async load() {
        const exampleModules = import.meta.glob('./examples/*.js');
        let examples = {};

        for (const [path, moduleLoader] of Object.entries(exampleModules)) {
            const module = await moduleLoader();

            /** @type {typeof Example | undefined} */
            const exportedClass = Object.values(module).find(value => typeof value === 'function' && value.prototype);

            if (!exportedClass || !this.#isSubclass(exportedClass, Example)) {
                console.error(`Warning: File ${path} does not export a class extended from Example.`);
                continue;
            }

            const info = exportedClass.info();
            examples[info.id] = {
                class: exportedClass,
                info: info,
            };
        }

        return examples;
    }

    /**
     * @param {object} examples
     * @param {HTMLDivElement} examplesContainer
     */
    addButtons(examples, examplesContainer) {
        Object.keys(examples)
            .sort()
            .forEach((id) => {
                const info = examples[id].info;
                const button = document.createElement('button');
                button.id = id;
                button.textContent = info.name;
                examplesContainer.appendChild(button);
            })
    }

    #isSubclass(subClass, superClass) {
        let current = subClass;
        while (current) {
            if (current === superClass) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }
        return false;
    }
}
