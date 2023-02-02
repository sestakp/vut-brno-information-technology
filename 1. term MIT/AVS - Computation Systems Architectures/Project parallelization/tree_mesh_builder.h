/**
 * @file    tree_mesh_builder.h
 *
 * @author  Pavel Šesták <xsesta07@stud.fit.vutbr.cz>
 *
 * @brief   Parallel Marching Cubes implementation using OpenMP tasks + octree early elimination
 *
 * @date    06.dec.2022
 **/

#ifndef TREE_MESH_BUILDER_H
#define TREE_MESH_BUILDER_H

#define MINSIZE 1
#include "base_mesh_builder.h"
#include <omp.h>

#define SQRT3_div2 0.86602540378

#define SQRT3 1.73205080757
class TreeMeshBuilder : public BaseMeshBuilder
{
public:
    TreeMeshBuilder(unsigned gridEdgeSize);

protected:
    unsigned marchCubes(const ParametricScalarField &field);
    unsigned octTree(Vec3_t<float> zero_position, unsigned mGridSizeLocal, const ParametricScalarField &field);
    float evaluateFieldAt(const Vec3_t<float> &pos, const ParametricScalarField &field);
    void emitTriangle(const Triangle_t &triangle);
    const Triangle_t *getTrianglesArray() const { return mTriangles.data(); }
    
    bool SurfaceIsNotHere(Vec3_t<float> zero_position, const ParametricScalarField &field, float GridSize);
    std::vector<std::vector<Triangle_t>> mTrianglesPrivate;
    
    std::vector<Triangle_t> mTriangles; ///< Temporary array of triangles
};

#endif // TREE_MESH_BUILDER_H
