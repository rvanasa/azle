import { Principal } from '@dfinity/principal';
import { run_tests, Test } from 'azle/test';
import { execSync } from 'child_process';
import { createActor } from './dfx_generated/func_types';

const func_types_canister = createActor('rrkah-fqaaa-aaaaa-aaaaq-cai', {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

const tests: Test[] = [
    {
        name: 'clear canister memory',
        prep: async () => {
            execSync(`dfx canister uninstall-code func_types || true`, {
                stdio: 'inherit'
            });
        }
    },
    {
        // TODO hopefully we can get rid of this: https://forum.dfinity.org/t/generated-declarations-in-node-js-environment-break/12686/16?u=lastmjs
        name: 'waiting for createActor fetchRootKey',
        wait: 5000
    },
    {
        name: 'deploy',
        prep: async () => {
            execSync(`dfx deploy`, {
                stdio: 'inherit'
            });
        }
    },
    {
        name: 'get_stable_func',
        test: async () => {
            const result = await func_types_canister.get_stable_func();

            return {
                ok:
                    result[0].toText() === 'aaaaa-aa' &&
                    result[1] === 'start_canister'
            };
        }
    },
    {
        name: 'basic_func_param',
        test: async () => {
            const result = await func_types_canister.basic_func_param([
                Principal.fromText('aaaaa-aa'),
                'create_canister'
            ]);

            return {
                ok:
                    result[0].toText() === 'aaaaa-aa' &&
                    result[1] === 'create_canister'
            };
        }
    },
    {
        name: 'basic_func_param_array',
        test: async () => {
            const result = await func_types_canister.basic_func_param_array([
                [Principal.fromText('aaaaa-aa'), 'create_canister'],
                [Principal.fromText('aaaaa-aa'), 'update_settings'],
                [Principal.fromText('aaaaa-aa'), 'install_code']
            ]);

            return {
                ok:
                    result[0][0].toText() === 'aaaaa-aa' &&
                    result[0][1] === 'create_canister' &&
                    result[1][0].toText() === 'aaaaa-aa' &&
                    result[1][1] === 'update_settings' &&
                    result[2][0].toText() === 'aaaaa-aa' &&
                    result[2][1] === 'install_code'
            };
        }
    },
    {
        name: 'basic_func_return_type',
        test: async () => {
            const result = await func_types_canister.basic_func_return_type();

            return {
                ok:
                    result[0].toText() === 'aaaaa-aa' &&
                    result[1] === 'create_canister'
            };
        }
    },
    {
        name: 'basic_func_return_type_array',
        test: async () => {
            const result = await func_types_canister.basic_func_return_type_array();

            return {
                ok:
                    result[0][0].toText() === 'aaaaa-aa' &&
                    result[0][1] === 'create_canister' &&
                    result[1][0].toText() === 'aaaaa-aa' &&
                    result[1][1] === 'update_settings' &&
                    result[2][0].toText() === 'aaaaa-aa' &&
                    result[2][1] === 'install_code'
            };
        }
    },
    {
        name: 'complex_func_param',
        test: async () => {
            const result = await func_types_canister.complex_func_param([
                Principal.fromText('aaaaa-aa'),
                'stop_canister'
            ]);

            return {
                ok:
                    result[0].toText() === 'aaaaa-aa' &&
                    result[1] === 'stop_canister'
            };
        }
    },
    {
        name: 'complex_func_return_type',
        test: async () => {
            const result = await func_types_canister.complex_func_return_type();

            return {
                ok:
                    result[0].toText() === 'aaaaa-aa' &&
                    result[1] === 'stop_canister'
            };
        }
    }
];

run_tests(tests);
